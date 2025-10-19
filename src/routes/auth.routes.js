import { Router } from "express";
import { register, login,  verifyOtp, logout, 
    verifyemail, requestResetPassword, resetpassword,refreshToken, otpResend  } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { google, callbackGoogle, redirectGoogle } from "../controllers/google.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/OtpVerify", verifyOtp)
router.post("/resend-otp", otpResend)
router.post("/logout",  authMiddleware, logout);
router.get("/verifyemail", verifyemail);
router.post("/requestreset", requestResetPassword);
router.post("/resetpassword", resetpassword);
router.post("/refresh-token", refreshToken);
router.post("/google", google);
router.get("/google-login",redirectGoogle)
router.get("/google-callback", callbackGoogle)

export default router;