import multer from "multer";

// hanya izinkan file gambar tertentu
const allowedTypeds = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const fileFilter = (req, file, cb) => {
  if (allowedTypeds.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Hanya mengizinkan gambar JPEG, JPG, PNG, dan WebP yg diperbolehkan"
      ),
      false
    );
  }
};
// simpan file di mememory RAM, bukan di harddisk
const storage = multer.memoryStorage();

// konfigurasi utama upload
export const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter,
});
