// export const generateOTP = () => Math.floor(1000 + Math.random() * 9000);

// export const expiredOTP = () => new Date().getTime() + 5 * 60 * 1000;


// Menghasilkan OTP 8 karakter acak (huruf dan angka)
export const generateOTP = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // Karakter yang diperbolehkan
  let otp = '';
  for (let i = 0; i < 8; i++) {
    otp += chars.charAt(Math.floor(Math.random() * chars.length)); // Pilih karakter secara acak
  }
  return otp;
};

// Menghasilkan waktu kedaluwarsa OTP (5 menit dari waktu saat ini)
export const expiredOTP = () => new Date().getTime() + 5 * 60 * 1000; // 5 menit dari waktu sekarang
