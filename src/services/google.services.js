import prisma from "../db/index.js";
import { OAuth2Client } from 'google-auth-library'
import jwt from "jsonwebtoken";
import axios  from "axios";
import { google } from "googleapis";


export const googleLogin = async({token}) => {

 const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
     const ticket = await client.verifyIdToken({
          idToken : token,
          audience : process.env.GOOGLE_CLIENT_ID

        })

        const payload = ticket.getPayload();
        const {email, name, avatar} = payload;


        let user = await prisma.users.findUnique({where : {email}});
const defaultAvatar = "https://res.cloudinary.com/demo/image/upload/v123456789/avatar.png";

        if(!user) {

            user = await prisma.users.create({
           data :

           {
            fullName : name, 
            email,
            phone : null,
           avatar: avatar || defaultAvatar,
          password: null,
          isVerified: true,
           }
                
            })
        }

 const appToken = jwt.sign(
  {id : user.id, email : user.email },
  process.env.JWT_SECRET,
  {expiresIn : "1h"}
 )

 const refreshToken = jwt.sign(
  {id : user.id},
  process.env.REFRESH_TOKEN_SECRET,
  {expiresIn :"7d"}

 )
 
 await prisma.users.update({
  where : {id : user.id},
  data : {refreshToken}
 })
 return {appToken, refreshToken}
}

export const googleRedirect = () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
  );

  const scopes = ["openid", "profile", "email"];

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });
};

export const googleCallback = async(code) => {

 const tokenResponse = await axios.post(
    "https://oauth2.googleapis.com/token",
    {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URL,
      grant_type: "authorization_code",
    },
    { headers: { "Content-Type": "application/json" } }
  );

  const { access_token, id_token } = tokenResponse.data;

  // 2. Ambil user info
  const userResponse = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
    { headers: { Authorization: `Bearer ${id_token}` } }
  );
  
  const { email, name, avatar } = userResponse.data;
  const defaultAvatar = "https://res.cloudinary.com/demo/image/upload/v123456789/avatar.png";

    let user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.users.create({
        data: {
          fullName: name,
          email,
          avatar: avatar || defaultAvatar,
          password: null,
          isVerified: false,
        }
      });
    }

   const appToken = jwt.sign(
  {id : user.id, email : user.email },
  process.env.JWT_SECRET,
  {expiresIn : "1h"}
 )

 const refreshToken = jwt.sign(
  {id : user.id},
  process.env.REFRESH_TOKEN_SECRET,
  {expiresIn :"7d"}

 )
 
 await prisma.users.update({
  where : {id : user.id},
  data : {refreshToken}
 })
   return { appToken, refreshToken, user };
 
}