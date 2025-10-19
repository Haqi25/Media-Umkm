import {loginUser, otpVerify, resendOtp,registerUser, verifyEmail,  AccessToken, resetPass, logoutUser } from "../services/auth.services.js"
import { Prisma } from "@prisma/client";
import { requestNewPassword } from "../services/auth.services.js";
export const register = async (req, res) => {

  
    try {
        const {
            fullName, 
            email,
            avatar,
            phone,
            password,
            confirmPassword
        } = req.body;
if (!password) {
  return res.status(400).json({ error: "Password tidak boleh kosong" });
}
if(password !== confirmPassword){
  return res.status(400).json({ error: "Password dan konfirmasi tidak sesuai" });
}
    const result = await registerUser({fullName, email, avatar, phone, password, confirmPassword})

    res.json({ message: "User Registered. Please check your email to verify.", data : result });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
  if (error.code === "P2002") {
    const target = error.meta?.target;

    if (target?.includes("email")) {
      return res.status(400).json({ error: "Email already registered" });
    }

    if (target?.includes("phone")) {
      return res.status(400).json({ error: "Phone already registered" });
    }

    return res.status(400).json({ error: "Unique constraint failed" });
  }
}
    res.status(500).json({ error: error.message });
  }
};

export const verifyemail = async (req, res) => {
    try {
        
        const {token} =  req.query;

        const user = await verifyEmail({token})
       


         res.json({message :"Email verified successfully!", data: user})
          if(!user) return res.status(400).json({ error : "invalid token"})
    } catch (error) {
      return res.status(500).json({error: error.message})
        
    }
}

export const login = async (req, res) =>{
    try {
        const {   
            email,
            password,
        } = req.body;
        
        if (!password || !email) {
 res.status(400).json({ error: "Password and Email is required" });
}

        const user = await loginUser({email, password})

        res.json({ message : "Kode OTP Dikirimkan di emailmu", user});
    } catch (error) {
        return res.status(500).json({error : error.message})
    }
};



export const verifyOtp = async(req, res) => {
try {
  const {email, otp} = req.body;

  const verify = await otpVerify({
    email,
    otp
  })

  res.json({verify})
}
 catch (error) {
  return res.status(500).json({error : error.message})
}
}

export const otpResend = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email wajib diisi" });
    }

    await resendOtp({ email });

    return res.status(200).json({
      message: "Kode OTP Berhasil diperbarui dan dikirim ke email Anda",
    });
  } catch (error) {
    console.error("Error resend OTP:", error);
    return res.status(500).json({ error: error.message });
  }
};
  
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body; 

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token required" });
    }

  const newAccessToken = await AccessToken({refreshToken})
 
      return res.json({
       newAccessToken
      });
    
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const requestResetPassword = async (req, res) => {

  try {
    const {email} = req.body;

    const requestLink = await requestNewPassword({email})
    res.json({message : "Reset password link sent to your email", requestLink})

  } catch (error) {
    return res.status(500).json({error : error.message})
  }
}

export const resetpassword = async (req, res) => {

  try {
    
    const {token} = req.query;
    const {newPassword} = req.body;

    const newPass = await resetPass({token, newPassword})
    
    res.json({ message : "Password reset successful!", newPass})
  }
  catch(error){
         return res.status(500).json({ error: error.message})
  }
}


export const logout = async (req, res) => {
 try {
  
  const userid = req.userId;

  const user = await logoutUser({userid})

res.json({ message : "Logout Successfully"}, user)
 } catch (error) {
    return res.status(500).json({error : error.message})
 }
};


