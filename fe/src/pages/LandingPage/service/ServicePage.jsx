import { motion } from "framer-motion";
import { FaTools, FaShieldAlt, FaClock } from "react-icons/fa";
import DOMPurify from "dompurify";

const services = [
  {
    title: "Software Development",
    description:
      "Solusi perangkat lunak web dan mobile untuk mendukung efisiensi, otomatisasi, dan pengalaman digital optimal.",
    icon: <FaTools className="text-yellow-400 text-4xl group-hover:rotate-6 transition-transform duration-300" />,
    link: "/SoftwareDevelopment",
  },
  {
    title: "Cyber Security",
    description:
      "Strategi keamanan berlapis untuk melindungi data, aplikasi, dan sistem bisnis dari ancaman siber yang terus berkembang.",
    icon: <FaShieldAlt className="text-red-500 text-4xl group-hover:scale-110 transition-transform duration-300" />,
    link: "/CyberSecurity",
  },
  {
    title: "Networking",
    description:
      "Infrastruktur jaringan handal, scalable, dan aman untuk memastikan konektivitas dan kolaborasi bisnis yang lancar.",
    icon: <FaClock className="text-cyan-400 text-4xl group-hover:rotate-12 transition-transform duration-300" />,
    link: "/Network",
  },
];

const Services = () => {
  return (
    <section
      id="services"
      className="bg-gradient-to-br from-black via-red-950 to-black text-white py-28 px-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 mb-4 drop-shadow">
            Layanan Kami
          </h2>

          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Jelajahi berbagai solusi yang ditawarkan oleh{" "}
            <span className="text-yellow-400 font-semibold">
              Xeranet Solutions Technology
            </span>{" "}
            untuk mendukung transformasi digital dan keamanan bisnis Anda.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 hover:shadow-2xl hover:shadow-red-800/20 p-8 transform transition-transform duration-300 hover:scale-[1.03]"
            >
              <a
                href={service.link}
                className="block h-full focus:outline-none focus:ring-0 rounded-xl"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-white/10 border border-white/10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-red-500/10">
                    {service.icon}
                  </div>
                </div>

                <h3
                  className="text-lg font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-red-500"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(service.title),
                  }}
                />
                <div className="mx-auto w-10 h-1 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full mb-4 group-hover:w-14 transition-all duration-300"></div>

                <p
                  className="text-sm text-gray-300 text-center leading-relaxed"
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
