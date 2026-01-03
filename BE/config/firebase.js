import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

const serviceAccount = process.env.FIREBASEADMINSERVICEKEY
  ? JSON.parse(process.env.FIREBASEADMINSERVICEKEY)
  : {};

if (!process.env.FIREBASEADMINSERVICEKEY) {
  console.warn("⚠️  FIREBASEADMINSERVICEKEY is missing in .env. Firebase functions will fail.");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
