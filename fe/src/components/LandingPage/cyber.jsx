import { motion } from 'framer-motion';
import { FaShieldAlt, FaNetworkWired, FaSearch, FaUserSecret, FaLaptopCode } from 'react-icons/fa';
import DOMPurify from 'dompurify';

const services = [
  {
    icon: <FaSearch />,
    title: "Vulnerability Assessment & Penetration Testing",
    desc: "Uji keamanan sistem Anda dengan pendekatan ofensif untuk menemukan dan memperbaiki celah sebelum dimanfaatkan oleh penyerang. <strong>Layanan ini sangat penting</strong> untuk organisasi yang mengelola data sensitif atau layanan digital publik.",
    iconColor: "text-blue-500",
  },
  {
    icon: <FaShieldAlt />,
    title: "Managed SOC & Threat Monitoring",
    desc: "Tim Security Operations Center (SOC) kami bekerja <em>24/7</em> untuk memantau, mendeteksi, dan merespon setiap aktivitas mencurigakan secara real-time. Solusi ini memastikan Anda tidak perlu khawatir terhadap serangan mendadak yang sulit dideteksi manual.",
    iconColor: "text-green-500",
  },
  {
    icon: <FaNetworkWired />,
    title: "Network Security & Firewall Hardening",
    desc: "Kami bantu Anda membangun fondasi jaringan yang kuat dan aman melalui konfigurasi firewall yang optimal, segmentasi jaringan, serta penerapan protokol komunikasi yang terenkripsi.",
    iconColor: "text-indigo-500",
  },
  {
    icon: <FaUserSecret />,
    title: "Security Awareness Training",
    desc: "70% serangan siber berhasil karena kelalaian manusia. Layanan ini dirancang untuk meningkatkan kesadaran keamanan tim Anda melalui pelatihan simulasi phishing, social engineering, dan best practice penggunaan sistem TI.",
    iconColor: "text-yellow-500",
  },
  {
    icon: <FaLaptopCode />,
    title: "Web & Application Security Audit",
    desc: "Audit menyeluruh terhadap aplikasi web dan mobile Anda untuk mengidentifikasi kelemahan terhadap standar <strong>OWASP Top 10</strong>, SQL Injection, XSS, dan lainnya.",
    iconColor: "text-red-500",
  },
];

const CyberSecurityPage = () => {
  return (
    <section className="bg-gradient-to-b from-black via-red-900 to-black text-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Layanan CyberSecurity</h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Kami hadir untuk membantu Anda menjaga kepercayaan pelanggan dan kelangsungan bisnis dengan solusi keamanan siber yang menyeluruh, proaktif, dan dapat disesuaikan.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-black/40 rounded-xl p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition"
            >
              <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full border border-neutral-700 bg-black/60">
                <span className={`text-2xl sm:text-3xl ${service.iconColor}`}>{service.icon}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{service.title}</h3>
              <p
                className="text-sm text-gray-300"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(service.desc),
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">
            Siap Melindungi Aset Digital Anda?
          </h3>
          <p className="text-gray-400 max-w-xl mx-auto mb-6">
            Hubungi kami hari ini dan dapatkan konsultasi gratis untuk mengidentifikasi kebutuhan keamanan siber Anda secara menyeluruh.
          </p>
          <a
            href="https://wa.me/+6287815969223?text=Halo,%20Saya%20tertarik%20dengan%20layanan%20CyberSecurity%20Anda.%20Bisa%20mendapatkan%20informasi%20lebih%20lanjut?"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-300 transform hover:scale-105"
          >
            Konsultasi Sekarang
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default CyberSecurityPage;
