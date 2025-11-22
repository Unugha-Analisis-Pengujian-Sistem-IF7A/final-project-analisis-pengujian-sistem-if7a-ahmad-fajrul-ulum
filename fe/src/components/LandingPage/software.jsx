import { motion } from "framer-motion";
import { FaLaptopCode, FaMobileAlt, FaCogs, FaCloud, FaDatabase, FaUser } from "react-icons/fa";
import DOMPurify from "dompurify";

const services = [
  {
    icon: <FaLaptopCode className="text-blue-500 text-3xl sm:text-4xl" />,
    title: "Custom Software Development",
    desc: "Kami mengembangkan perangkat lunak kustom yang dirancang untuk memenuhi kebutuhan unik bisnis Anda. Dari aplikasi desktop hingga sistem berbasis web, kami memberikan solusi yang skalabel dan efisien.",
  },
  {
    icon: <FaMobileAlt className="text-green-500 text-3xl sm:text-4xl" />,
    title: "Mobile App Development",
    desc: "Aplikasi mobile untuk platform iOS dan Android, dengan desain intuitif dan performa tinggi. Kami mengembangkan aplikasi native atau cross-platform yang memberikan pengalaman terbaik bagi pengguna.",
  },
  {
    icon: <FaCogs className="text-orange-500 text-3xl sm:text-4xl" />,
    title: "Enterprise Software Solutions",
    desc: "Solusi perangkat lunak tingkat perusahaan untuk membantu bisnis Anda mengelola proses internal secara efisien. Mulai dari ERP hingga CRM, kami menyediakan solusi yang mengoptimalkan operasional perusahaan.",
  },
  {
    icon: <FaCloud className="text-purple-500 text-3xl sm:text-4xl" />,
    title: "Cloud Solutions",
    desc: "Pengembangan aplikasi berbasis cloud untuk meningkatkan aksesibilitas, skalabilitas, dan efisiensi. Solusi berbasis cloud memungkinkan bisnis Anda untuk beroperasi dengan lebih fleksibel dan aman.",
  },
  {
    icon: <FaDatabase className="text-yellow-500 text-3xl sm:text-4xl" />,
    title: "API Development & Integration",
    desc: "Membuat dan mengintegrasikan API untuk meningkatkan fungsionalitas aplikasi Anda, memungkinkan integrasi dengan layanan eksternal dan sistem internal secara mulus.",
  },
  {
    icon: <FaUser className="text-pink-500 text-3xl sm:text-4xl" />,
    title: "UI/UX Design",
    desc: "Desain antarmuka pengguna yang menarik dan pengalaman pengguna yang intuitif. Kami berfokus pada desain yang meningkatkan kepuasan pengguna, mempercepat adopsi aplikasi, dan menjaga interaksi yang mulus.",
  },
];

const SoftwareDevelopmentPage = () => {
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
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Layanan Software Development</h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Kami menghadirkan solusi perangkat lunak yang inovatif dan dapat disesuaikan dengan kebutuhan bisnis Anda. Dengan pendekatan berbasis teknologi terbaru, kami membantu Anda menciptakan aplikasi yang meningkatkan efisiensi dan kinerja.
          </p>
        </motion.div>

        {/* Services */}
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
              <div className="mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-black/50 border border-neutral-700">
                {service.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{service.desc}</p>
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
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">Siap Meningkatkan Bisnis Anda dengan Software Inovatif?</h3>
          <p className="text-gray-400 max-w-xl mx-auto mb-6">
            Hubungi kami hari ini untuk mendapatkan solusi perangkat lunak yang sesuai dengan kebutuhan unik bisnis Anda. Tim kami siap memberikan konsultasi gratis.
          </p>
          <a
            href="https://wa.me/+6287815969223?text=Halo,%20Saya%20tertarik%20dengan%20layanan%20Software%20Development%20Anda.%20Bisa%20mendapatkan%20informasi%20lebih%20lanjut?"
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

export default SoftwareDevelopmentPage;
