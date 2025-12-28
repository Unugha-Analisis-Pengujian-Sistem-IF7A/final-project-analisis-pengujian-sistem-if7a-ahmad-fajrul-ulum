import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import admin from "../config/firebase.js";
import { expiredOTP, generateOTP } from "../service/generateOTP.js";
import transporter from "../config/mailer.js";

export const register = async (req, res) => {
  try {
    const { userName, email, password, fullName, role } = req.body;

    // Validasi email & password
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const roleOptions = ["admin", "user"];
    const isValidRole = roleOptions.includes(role) ? role : "user";

    const [firebaseUser, hashedPassword] = await Promise.all([
      admin.auth().createUser({ email, password }),
      bcrypt.hash(password, 10),
    ]);

    const newUser = new User({
      _id: firebaseUser.uid,
      userName,
      email,
      password: hashedPassword,
      fullName,
      role: isValidRole,
      imgProfile: null,
    });

    await newUser.save();
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: `Failed to register: ${error.message}` });
  }
};

export const login = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken)
      return res.status(400).json({ message: "ID token is required" });

    const decoded = await admin.auth().verifyIdToken(idToken);
    if (!decoded?.uid)
      return res.status(401).json({ message: "Invalid ID token" });

    const user = await User.findById(decoded.uid);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Sinkronisasi dengan Firebase jika perlu
    if (!user.firebaseId) {
      try {
        const firebaseUserCheck = await admin.auth().getUser(user._id);
        if (firebaseUserCheck) {
          user.firebaseId = firebaseUserCheck.uid;
          await user.save();
        }
      } catch (err) {
        if (err.code === "auth/user-not-found") {
          const firebaseUser = await admin.auth().createUser({
            uid: user._id,
            email: user.email,
            password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8),
            displayName: user.fullName,
            photoURL: user.imgProfile || undefined,
          });
          user.firebaseId = firebaseUser.uid;
          await user.save();
        } else {
          console.error("❌ Firebase error:", err);
          return res
            .status(500)
            .json({ message: "Error with Firebase", error: err.message });
        }
      }
    }

    // Kirim OTP ke SEMUA user dan admin
    const otp = generateOTP();
    const expire = new Date(expiredOTP());

    user.otpCode = otp;
    user.otpExpire = expire;
    await user.save();


    await transporter.sendMail({
      from: `"Xeranet Security" <${process.env.EMAIL}>`,
      to: user.email,
      subject: "Your OTP Code – Secure Login Verification",
      html: `
        <div style="margin: 0; padding: 0; background-color: #f4f4f5;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td style="padding: 20px 12px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
                  
                  <!-- Logo -->
                  <tr>
                    <td style="padding: 24px 16px 0 16px; text-align: center;">
                      <img src="https://i.postimg.cc/B6PxWYmF/hehe.png" alt="XERANET Logo" style="height: 26px; max-width: 120px; display: inline-block;" />
                    </td>
                  </tr>



                  <!-- Divider -->
                  <tr>
                    <td style="padding: 24px 20px 0;">
                      <hr style="border: none; border-top: 1px solidrgb(185, 185, 185);">
                    </td>
                  </tr>

                  <!-- Message Body -->
                  <tr>
                    <td style="padding: 20px;">
                      <p style="font-size: 15px; color: #111827; margin: 0;">Hi <strong>${user.fullName || "User"}</strong>,</p>
                      <p style="font-size: 14px; color: #374151; line-height: 1.5; margin: 12px 0 0 0;">
                        Use the following One-Time Password (OTP) to complete your login. It will expire in <strong>5 minutes</strong>. Please keep it secure.
                      </p>

                      <!-- OTP Code -->
                      <div style="margin: 28px 0; text-align: center;">
                        <div style="
                          display: inline-block;
                          background-color: #f3f4f6;
                          padding: 16px 24px;
                          border-radius: 8px;
                          font-size: 28px;
                          font-weight: 600;
                          color: #111827;
                          border: 1px solid #d1d5db;
                          letter-spacing: 6px;
                        ">
                          ${otp}
                        </div>
                      </div>

                      <p style="font-size: 13px; color: #6b7280; line-height: 1.4;">
                        If you didn’t request this code, you can safely ignore this email or reach out to our support team.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #9ca3af; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
                      &copy; ${new Date().getFullYear()} Xeranet Solutions Technology. All rights reserved.
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </div>
      `
    });


    return res
      .status(200)
      .json({ message: "OTP sent to your email", require2fa: true });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: `Login failed: ${error.message}` });
  }
};


export const verify2FA = async (req, res) => {
  try {
    const { uid, otp } = req.body;
    const user = await User.findById(uid);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otpCode !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpire < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.otpCode = null;
    user.otpExpire = null;
    await user.save();

    // 👉 Buat custom token untuk dikirim ke FE
    const customToken = await admin.auth().createCustomToken(uid);

    // ✅ Jangan simpan ke cookie — kirim ke frontend
    res.status(200).json({
      message: "2FA verified, please sign in with custom token",
      customToken,
      user,
    });
  } catch (error) {
    console.error("Verify2FA error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    const expire = new Date(expiredOTP());

    user.otpCode = otp;
    user.otpExpire = expire;
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Reset Password",
      text: `Your reset password OTP is ${otp}. This OTP will expire in 5 minutes.`,
    });

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("ForgotPassword error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otpCode !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpire < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.otpCode = null;
    user.otpExpire = null;
    await user.save();

    res.status(200).json({ message: "Password reset success" });
  } catch (error) {
    console.error("ResetPassword error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select(
      "_id userName email fullName imgProfile role"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ message: `Failed to get user: ${error.message}` });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("authToken");
    res.json({ message: "Logout success" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: `Failed to logout: ${error.message}` });
  }
};
