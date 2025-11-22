import { motion } from "framer-motion";
import { FaTools, FaShieldAlt, FaClock } from "react-icons/fa";
import DOMPurify from "dompurify";

const services = [
  {
    title: "Software Development",
    description:
      "Solusi perangkat lunak web dan mobile yang dirancang untuk memenuhi kebutuhan bisnis Anda, meningkatkan performa dan pengalaman pengguna.",
    icon: <FaTools className="text-yellow-400 text-4xl sm:text-5xl" />,
    link: "/SoftwareDevelopment",
  },
  {
    title: "Cyber Security",
    description:
      "Lindungi data dan sistem Anda dari ancaman digital dengan layanan audit, proteksi, dan monitoring yang dapat diandalkan.",
    icon: <FaShieldAlt className="text-red-500 text-4xl sm:text-5xl" />,
    link: "/CyberSecurity",
  },
  {
    title: "Networking",
    description:
      "Bangun infrastruktur jaringan yang scalable, aman, dan stabil untuk mendukung operasi bisnis yang lebih efisien.",
    icon: <FaClock className="text-cyan-400 text-4xl sm:text-5xl" />,
    link: "/Network",
  },
];

const Services = () => {
  return (
    <section
      id="services"
      className="bg-gradient-to-b from-black via-red-900 to-black text-white py-24 px-4 sm:px-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
            Layanan Kami
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Di{" "}
            <span className="text-yellow-400 font-semibold">
              Xeranet Solutions Technology
            </span>
            , kami menyediakan solusi teknologi canggih untuk membantu bisnis Anda berkembang.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 transition-all transform duration-300 hover:scale-105 hover:border-red-500/30 hover:shadow-xl"
            >
              <a href={service.link} className="block text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 border border-white/10 rounded-full flex items-center justify-center group-hover:bg-red-500/10 transition-all duration-300">
                    {service.icon}
                  </div>
                </div>

                <h3
                  className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(service.title),
                  }}
                />

                <p
                  className="text-sm sm:text-base text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(service.description),
                  }}
                />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
