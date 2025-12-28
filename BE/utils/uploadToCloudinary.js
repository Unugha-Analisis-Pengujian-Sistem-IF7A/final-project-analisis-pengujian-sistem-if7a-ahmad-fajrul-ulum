import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import sharp from "sharp";
import axios from "axios";

// ✅ Upload ke Cloudinary (pakai sharp jika image)
export const uploadToCloudinary = async (
  fileBuffer,
  file,
  folder = "uploads"
) => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) return reject(new Error("File buffer is empty"));

    const isImage = file?.mimetype?.startsWith("image/");
    const resourceType = isImage ? "image" : "raw";

    (async () => {
      try {
        const processedBuffer = isImage
          ? await sharp(fileBuffer)
            .resize({ width: 1200 }) // optional: resize max width 1200px
            .jpeg({ quality: 80 }) // optional: compress to jpeg
            .toBuffer()
          : fileBuffer;

        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: resourceType,
            use_filename: true,
            transformation: isImage
              ? [{ quality: "auto" }, { fetch_format: "auto" }]
              : undefined,
          },
          (error, result) => {
            if (error) {
              console.log("Upload error:", error);
              return reject(error);
            }
            resolve({
              url: result.secure_url,
              public_id: result.public_id,
            });
          }
        );

        streamifier.createReadStream(processedBuffer).pipe(uploadStream);
      } catch (err) {
        console.log("Error processing file:", err);
        reject(err);
      }
    })();
  });
};

// ✅ Validasi URL eksternal yang diizinkan
export const isValidImageUrl = (url) => {
  return /^https:\/\/(res\.cloudinary\.com|images\.unsplash\.com|cdn\.example\.com)\//.test(
    url
  );
};

// ✅ Download gambar dari URL lalu upload ke Cloudinary
export const downloadAndUpload = async (imageUrl, folder = "profile") => {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

    const mimetype = response.headers["content-type"];
    if (!mimetype.startsWith("image/")) {
      throw new Error("Invalid image format");
    }

    const buffer = Buffer.from(response.data);
    return await uploadToCloudinary(buffer, { mimetype }, folder);
  } catch (error) {
    console.log("Error downloading image:", error);
    throw new Error("Error downloading image");
  }
};
