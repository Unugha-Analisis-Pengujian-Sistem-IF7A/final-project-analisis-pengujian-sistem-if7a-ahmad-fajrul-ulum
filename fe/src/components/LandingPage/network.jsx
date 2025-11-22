import { motion } from 'framer-motion';
import {
  FaNetworkWired,
  FaRoute,
  FaWifi,
  FaServer,
  FaExchangeAlt,
  FaCloud,
} from 'react-icons/fa';
import DOMPurify from 'dompurify';

const services = [
  {
    icon: <FaNetworkWired />,
    title: "Network Infrastructure Design",
    desc: "Kami merancang dan membangun infrastruktur jaringan yang kuat dan skalabel, mulai dari kabel hingga solusi wireless, untuk memastikan konektivitas yang andal dan efisien di seluruh organisasi Anda.",
    iconColor: "text-indigo-500",
  },
  {
    icon: <FaRoute />,
    title: "Router & Switch Configuration",
    desc: "Kami menyediakan konfigurasi router dan switch yang optimal, memastikan jaringan Anda aman, cepat, dan efisien. Kami juga membantu dalam pemecahan masalah dan pemeliharaan sistem.",
    iconColor: "text-green-500",
  },
  {
    icon: <FaWifi />,
    title: "Wireless Network Solutions",
    desc: "Membangun jaringan wireless yang cepat dan stabil dengan jangkauan luas, cocok untuk bisnis yang membutuhkan konektivitas mobile atau memiliki banyak lokasi.",
    iconColor: "text-yellow-500",
  },
  {
    icon: <FaServer />,
    title: "Data Center Setup & Management",
    desc: "Kami mendesain dan mengelola data center yang aman dan efisien, dengan kemampuan skalabilitas tinggi. Solusi kami memastikan keandalan dan kecepatan akses data tanpa gangguan.",
    iconColor: "text-red-500",
  },
  {
    icon: <FaExchangeAlt />,
    title: "Network Security & Monitoring",
    desc: "Kami mengimplementasikan solusi keamanan jaringan untuk melindungi data dan sumber daya Anda dari ancaman eksternal dan internal. Monitoring jaringan dilakukan 24/7 untuk mendeteksi potensi risiko lebih awal.",
    iconColor: "text-blue-500",
  },
  {
    icon: <FaCloud />,
    title: "Cloud Networking Solutions",
    desc: "Integrasi jaringan dengan solusi cloud untuk meningkatkan fleksibilitas dan skalabilitas. Kami menghubungkan kantor cabang dan aplikasi berbasis cloud untuk memberikan konektivitas yang aman dan efisien.",
    iconColor: "text-purple-500",
  },
];

const NetworkingPage = () => {
  return (
    <section id="services" className="bg-gradient-to-b from-black via-blue-900 to-black text-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Layanan Jaringan</h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Kami menyediakan solusi jaringan yang cepat, aman, dan efisien untuk memastikan konektivitas optimal di seluruh infrastruktur Anda. Dari desain hingga implementasi, kami siap mendukung pertumbuhan bisnis Anda.
          </p>
        </motion.div>

        {/* Services */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const sanitizedTitle = DOMPurify.sanitize(service.title);
            const sanitizedDesc = DOMPurify.sanitize(service.desc);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/40 p-6 rounded-xl flex flex-col items-center text-center shadow-lg hover:shadow-xl transition"
              >
                <div className="mb-4 w-16 h-16 bg-black/50 border border-neutral-700 rounded-full flex items-center justify-center">
                  <span className={`text-3xl sm:text-4xl ${service.iconColor}`}>{service.icon}</span>
                </div>
                <h3
                  className="text-lg sm:text-xl font-semibold mb-2"
                  dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
                />
                <p
                  className="text-sm text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: sanitizedDesc }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">Siap Memperkuat Jaringan Anda?</h3>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Hubungi kami hari ini untuk mendapatkan solusi jaringan yang andal dan aman, sesuai dengan kebutuhan perusahaan Anda. Tim kami siap memberikan konsultasi gratis.
          </p>
          <a
            href="https://wa.me/+6287815969223?text=Halo,%20Saya%20tertarik%20dengan%20layanan%20Networking%20Anda.%20Bisa%20mendapatkan%20informasi%20lebih%20lanjut?"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300 transform hover:scale-105"
          >
            Konsultasi Sekarang
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default NetworkingPage;
