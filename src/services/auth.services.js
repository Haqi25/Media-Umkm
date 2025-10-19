import prisma from "../db/index.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";


export const registerUser = async({fullName, email, avatar, phone, password, confirmPassword}) => {

       const hashedPassword = await bcrypt.hash(password, 10);

       const defaultAvatar = "https://res.cloudinary.com/demo/image/upload/v123456789/avatar.png";
        const token = jwt.sign({email}, process.env.JWT_SECRET,{expiresIn : "1d"});
        const user = await prisma.users.create({
            data:
            {
            fullName, 
            email,
            phone,
           avatar: avatar || defaultAvatar,
            password : hashedPassword,
            isVerified : false,
            verifyToken: token
            },
        });
     const verifylink = `http://localhost:3000/verify?token=${token}`;

  const transporter = nodemailer.createTransport({
        service : "gmail",
        auth : {
            user : process.env.EMAIL_USER,
            pass : process.env.USER_PASS
        }
    })

        await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email",
      html: `
        <h3>Welcome, ${fullName}!</h3>
        <p>Please verify your email by clicking below:</p>
        <a href="${verifylink}">${verifylink}</a>
      `,
    });

    return {id : user.id, email: user.email, fullName: user.fullName}
}


export const verifyEmail = async({token}) => {
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
 const user = await prisma.users.findFirst({
      where: {
        email: decoded.email,
        verifyToken: token,
      },
    })
     await prisma.users.update({
            where: {id : user.id},
            data : 
            { isVerified : true, verifyToken: null}
        });
   return {id: user.id, email: user.email, fullName: user.fullName}
}


export const loginUser = async({email, password})=>{

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) throw new Error ("User Not Found");

    if (!user.isVerified) {
        throw new Error("Please verify your email")    
    }

 const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid){
    throw new Error("Password Salah")

  }
    
 
  const otp = crypto.randomInt(100000, 999999).toString();
  const expires = new Date(Date.now() + 5 * 60 * 1000); 

  await prisma.users.update({
    where: { email },
    data: { otp, otpExpires: expires },
  });

  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.USER_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Kode OTP Login Kamu",
    text: `Kode OTP kamu adalah ${otp}. Berlaku 5 menit.`,
  });

   

}

export const resendOtp = async({email}) => {
  
  const user = await prisma.users.findUnique({where: {email}})

   const otp = Math.floor(100000 + Math.random() * 900000).toString();

   await prisma.users.update({
    where : {email},
    data : {
       otp,
      otpExpires: new Date(Date.now() + 5 * 60 * 1000),
    }
   })

   const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
      user : process.env.EMAIL_USER,
      pass : process.env.USER_PASS
    }

   })

   await transporter.sendMail({
    from : `"Media UMKM" <${process.env.EMAIL_USER}>`,
    to : email,
    subject: "Kode OTP Baru Anda",
    text : `Kode verifikasi baru Anda adalah: ${otp}`
    
   })
}
export const otpVerify = async({email, otp}) => {

  if(!email || !otp){
    throw new Error("Otp dan Wajib diisi")
  }

  const user = await prisma.users.findUnique({
    where : {email}
  })

  if(user.otp !== otp){
    throw new Error("Kode OTP salah")
  }

  await prisma.users.update({
   where : {email},
   data : {
    otp : null,
    otpExpires:null
   }
  })

    const token = jwt.sign(
    {id: user.id, email: user.email},
    process.env.JWT_SECRET,
    {expiresIn: "1h"}
  )
   const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    await prisma.users.update({
      where: { id: user.id },
      data: { refreshToken },
    });

return {token, refreshToken}


}

export const AccessToken = async({refreshToken}) => {
  const user = await prisma.users.findFirst({
       where: { refreshToken },
     });
 
     if (!user) {
      throw new Error("Invalid Refresh Token")
     }
 
    
     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
       if (err) {
         return res.status(403).json({ error: "Expired or invalid refresh token" });
       }
 
     
       const newAccessToken = jwt.sign(
         { id: user.id },
         process.env.JWT_SECRET,
         { expiresIn: "15m" }
       );

       return {newAccessToken}
});
}


export const requestNewPassword  = async({email}) => {
   const user = await prisma.users.findUnique({ where : {email}});

    if (!user) return res.status(404).json({ error : "User Not Found"});

    if(!user.isVerified) return res.status(400).json({error : "User Not Verified"})

    const token = jwt.sign(

      {email : user.email},
      process.env.JWT_SECRET,
      { expiresIn: "20m"}

    )

    await prisma.users.update({
      where : {id : user.id},
      data :{verifyToken : token}
  })


    const resetlink = `http://localhost:3000/resetpassword?token=${token}`

      const transporter = nodemailer.createTransport({
        service : "gmail",
        auth : {
            user : process.env.EMAIL_USER,
            pass : process.env.USER_PASS
        }
    })
  await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email",
      html: `
        <h3>Welcome, ${user.fullName}!</h3>
        <p>Please reset your password by clicking below:</p>
        <a href="${resetlink}">${resetlink}</a>
      `,
    });
}

export const resetPass = async({token, newPassword})=>{

  const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await prisma.users.findFirst({
      where : {email : decoded.email, verifyToken : token}
    })

    if(!user) return res.status(404).json({message : "User not found"});
    if(!user.isVerified) return res.status(403).json({message : "user not verified please verify first"})

      const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.users.update({
      where : {id : user.id},
      data : { password : hashedPassword, verifyToken : null}
  })
}


export const logoutUser =  async({userid}) => {

     const user = await prisma.users.update({
      where : {id : userid},
      data: {refreshToken: null}
     })

     return{user}
}