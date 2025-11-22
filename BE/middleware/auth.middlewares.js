import User from "../models/user.models.js";
import admin from "../config/firebase.js";

export const verifyIdToken = async (req, res, next) => {
  try {
    const token =
      req.cookies.authToken ||
      (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: no token" });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    if (!decoded || !decoded.uid) {
      return res.status(401).json({ message: "Unauthorized: invalid token" });
    }

    const user = await User.findById(decoded.uid);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorized: invalid token" });
  }
};

export const verifyAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: not admin" });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorized: invalid token" });
  }
};
