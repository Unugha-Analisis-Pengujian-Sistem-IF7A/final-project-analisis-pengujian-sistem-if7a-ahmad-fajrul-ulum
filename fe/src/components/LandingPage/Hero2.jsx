import { motion } from "framer-motion";
import { FaShieldAlt, FaCode, FaNetworkWired } from "react-icons/fa";
import DOMPurify from "dompurify";

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.8,
      ease: "easeOut",
    },
  }),
};

const safeText = (text) => DOMPurify.sanitize(text);

const WhyUs = () => {
  return (
    <section className="bg-gradient-to-b from-black via-red-900 to-black text-white px-4 sm:px-6 md:px-10 py-24 sm:py-32">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            {safeText("Mengapa Kami ?")}
          </h1>
          <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            {safeText(
              "Kami bukan hanya penyedia layanan, kami adalah mitra transformasi digital Anda. Dengan teknologi mutakhir dan pendekatan strategis, kami hadir untuk membuat Anda unggul."
            )}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              icon: <FaShieldAlt className="text-red-500 text-3xl sm:text-4xl" />,
              title: "Keamanan Tingkat Tinggi",
              desc: "Sistem keamanan berlapis, monitoring 24/7, dan layanan penetration testing untuk menjaga aset Anda tetap aman.",
            },
            {
              icon: <FaCode className="text-yellow-400 text-3xl sm:text-4xl" />,
              title: "Solusi Software Kustom",
              desc: "Platform digital yang dibangun sesuai kebutuhan bisnis Anda — skalabel, efisien, dan terintegrasi penuh.",
            },
            {
              icon: <FaNetworkWired className="text-white text-3xl sm:text-4xl" />,
              title: "Jaringan & Infrastruktur",
              desc: "Arsitektur jaringan modern yang menjamin uptime, kecepatan, dan keamanan optimal untuk bisnis anda.",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariant}
              className="bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-2xl transition duration-300 transform hover:scale-105 group"
            >
              <div className="flex items-start gap-4 mb-4 sm:mb-6">
                {card.icon}
                <h2 className="text-lg sm:text-xl font-semibold text-white">
                  {safeText(card.title)}
                </h2>
              </div>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {safeText(card.desc)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
