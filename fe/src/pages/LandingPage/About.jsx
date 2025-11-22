/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { FaEye, FaBullseye, FaHeart } from "react-icons/fa";

const About = () => {
  return (
    <section className="w-full bg-gradient-to-b from-[#1a0000] via-[#0d0d0d] to-black text-white py-24 px-4 sm:px-6 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 mb-4 drop-shadow">
            Tentang Xeranet
          </h2>
          <div className="mx-auto w-16 h-1 bg-gradient-to-r from-red-500 to-yellow-300 rounded-full mb-6 animate-pulse" />
          <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-4xl mx-auto leading-relaxed">
            Xeranet Solutions Technology adalah perusahaan teknologi yang berfokus pada transformasi digital
            melalui solusi inovatif di bidang pengembangan perangkat lunak, keamanan siber, dan infrastruktur jaringan.
            Kami hadir untuk membantu bisnis membangun fondasi digital yang kokoh dan berkelanjutan.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card Component */}
          {[
            {
              icon: <FaEye />,
              title: "Visi Kami",
              delay: 0.3,
              content:
                "Menjadi mitra strategis utama dalam perjalanan digitalisasi bisnis, dengan menyediakan solusi teknologi yang relevan, aman, dan berdampak nyata pada pertumbuhan jangka panjang.",
            },
            {
              icon: <FaBullseye />,
              title: "Misi Kami",
              delay: 0.4,
              content: (
                <ul className="list-disc list-inside space-y-2">
                  <li>Mengembangkan solusi teknologi yang handal dan berdaya guna.</li>
                  <li>Memberikan layanan yang adaptif dan berorientasi pada kebutuhan bisnis.</li>
                  <li>Mendorong efisiensi operasional melalui automasi dan sistem cerdas.</li>
                  <li>Menjaga standar keamanan dan kualitas sebagai prioritas utama.</li>
                </ul>
              ),
            },
            {
              icon: <FaHeart />,
              title: "Nilai Inti",
              delay: 0.5,
              content: (
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Integritas:</strong> Transparansi dan etika sebagai fondasi.</li>
                  <li><strong>Inovasi:</strong> Adaptif terhadap perkembangan teknologi.</li>
                  <li><strong>Kolaborasi:</strong> Sinergi untuk solusi terbaik.</li>
                  <li><strong>Komitmen:</strong> Fokus penuh pada keberhasilan klien.</li>
                  <li><strong>Keamanan:</strong> Proteksi data dan sistem menyeluruh.</li>
                </ul>
              ),
            },
          ].map(({ icon, title, content, delay }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay }}
              className="relative group bg-gradient-to-br from-[#1a1a1a] to-[#111111] border border-white/10 rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg overflow-hidden transition duration-300 hover:border-red-500"
            >
              {/* Icon and Title */}
              <div className="absolute -top-5 -left-5 w-20 h-20 bg-red-500/10 blur-xl rounded-full group-hover:scale-125 transition-transform duration-300"></div>
              <div className="flex items-center space-x-3 mb-4 z-10 relative text-red-500 text-xl sm:text-2xl">
                {icon}
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">{title}</h3>
              </div>
              <div className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed relative z-10">
                {content}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default About;
