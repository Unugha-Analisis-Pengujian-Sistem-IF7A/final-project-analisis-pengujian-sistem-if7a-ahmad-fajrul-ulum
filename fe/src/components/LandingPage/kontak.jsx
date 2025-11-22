import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";
import { motion } from "framer-motion";

const ContactPage = () => {
  const contacts = [
    {
      icon: <FaMapMarkerAlt />,
      title: "Alamat",
      desc: "Klapagading, Kec. Wangon, Kabupaten Banyumas, Jawa Tengah",
      color: "text-yellow-400"
    },
    {
      icon: <FaPhoneAlt />,
      title: "Telepon",
      desc: "+62 878-1596-9223",
      color: "text-red-400"
    },
    {
      icon: <FaEnvelope />,
      title: "Email",
      desc: "info@xeranet.id",
      color: "text-cyan-400"
    },
    {
      icon: <FaClock />,
      title: "Jam Operasional",
      desc: "Senin - Jumat: 08.00 - 17.00\nSabtu & Minggu: Libur",
      color: "text-pink-400"
    },
  ];

  return (
    <section className="bg-gradient-to-br from-black via-red-950 to-black text-white py-28 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
         <motion.div
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 mb-4 drop-shadow">
            Tentang Xeranet
          </h2>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Kami siap membantu Anda! Hubungi tim{" "}
            <span className="text-yellow-400 font-medium">Xeranet Solutions Technology</span>{" "}
            melalui kontak berikut untuk informasi lebih lanjut.
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 gap-10">
          {contacts.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:shadow-2xl hover:shadow-red-800/20 p-6"
            >
              <div className="flex items-start space-x-4">
                <div className="min-w-[48px] min-h-[48px] w-12 h-12 bg-white/10 border border-white/10 rounded-full flex items-center justify-center shrink-0">
                  <div className={`text-2xl ${item.color}`}>{item.icon}</div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">{item.title}</h2>
                  {item.desc.split("\n").map((line, i) => (
                    <p key={i} className="text-gray-400 leading-relaxed text-sm">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
