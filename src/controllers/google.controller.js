import { json } from 'stream/consumers';
import { googleLogin, googleRedirect,googleCallback  } from '../services/google.services.js';
import swal from 'sweetalert2'

export const google = async (req, res) => {
  try {
    const { token } = req.body;

    const { appToken, refreshToken } = await googleLogin({ token });

    res.status(200).json({
      message: "Login Google berhasil",
      appToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//redirect google 

export const redirectGoogle = async(req, res) => {
       
 try {
    const redirectUrl = googleRedirect();
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error("Google redirect error:", error);
    return res.status(500).json({ error: error.message });
  }

    
   
}

//callback google 

export const callbackGoogle = async(req, res) => {

   try {
    const {code}  = req.query;
    if (!code) {
      return res.status(400).json({ error: "Kode otorisasi tidak ditemukan" });
    }

    const { appToken, refreshToken, user } = await googleCallback(code);

    // Set cookie
    res.cookie("token", appToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600000, // 1 jam
    });

     
    return  res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${appToken}`);
    
  } catch (error) {
    console.error("Google Login Error:", error);
    return res.status(500).json({ error: error.message });
  }
    
}