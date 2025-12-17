import User from "../models/User.model.js";
import jwt from 'jsonwebtoken'

export const registration = async (req, res) => {
    const { fullName, email, password } = req.body;
    if ( !fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }
    const exitingUser = await User.findOne({ email });
    if (exitingUser && exitingUser.isVerified) {
        return res.status(409).json({ message: "User already exists" })
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = Date.now() + 1000 * 60 * 5
    if (!exitingUser) {
        const newUser = new User({
            fullName,
            email,
            password,
            otpCode: otpCode,
            expiredOtp: otpExpiresAt
        });
        await newUser.save();



        
        //send otp is missing





        return res.status(201).json({ message: "User registered successfully. Please verify your email." })
    } else {
        exitingUser.otpCode = otpCode;
        exitingUser.expiredOtp = otpExpiresAt;
        await exitingUser.save();
        return res.status(200).json({ message: "OTP resent successfully. Please verify your email." })
    }
}

export const verifyRegistration = async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (!user.isVerified) {
        return res.status(400).json({ message: "User already verified" });
    }

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    const currentTime = Date.now()
    if (currentTime > user.expiredOtp) {
        return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }
    if (user.otpCode !== otp) {
        return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

    user.isVerified = true;
    user.otpCode = undefined;
    user.expiredOtp = undefined;
    await user.save();
    return res.status(200).json({ message: "OTP verified successfully." });
}


export const login = async(req, res)=>{
    const {email, password} = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "email and password are required" })
    }

    const user = User.findOne({email})
    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    const isPassMatched = await user.isPasswordCorrect(password)

    if (!isPassMatched) {
        return res.status(400).json({ message: "password is not matched" })
    }

    user.password = undefined

    const token = await jwt.sign(
        {userId: user._id},
        process.env.TOKEN_SECRET_KEY,
        {expiresIn: process.env.TOKEN_EXPIRED_TIME}
    )

    const tokenOption = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 10 * 24 * 60 * 60 * 1000,
    }

    return res
        .status(201)
        .cookie('token', token, tokenOption)
        .json({ data:user, message: "user loggedIn successfully" })
}

export const logout = async(req, res)=>{
     try {
        const tokenOption = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        }

        return res
            .status(200)
            .clearCookie('token', tokenOption)
            .json({ message: "user logged out successfully" })
            
    } catch (error) {
        return res.status(500).json({ message: "user logged out failed" })
    }
}