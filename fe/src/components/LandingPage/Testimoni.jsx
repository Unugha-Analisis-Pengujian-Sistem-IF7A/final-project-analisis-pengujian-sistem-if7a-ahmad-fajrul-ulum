import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTestimonials } from "../../app/data/testimoniSlice";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { FaQuoteLeft } from "react-icons/fa";
import "swiper/css";
import "swiper/css/autoplay";

const TestimonialCard = ({ t }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-6 sm:p-8 rounded-3xl shadow-lg ring-1 ring-white/10 h-full flex flex-col justify-between"
  >
    <div>
      <FaQuoteLeft className="text-red-500 text-xl sm:text-2xl mb-4" />
      <p className="text-gray-300 text-sm sm:text-base leading-relaxed italic mb-6">
        “{t?.content || "Tidak ada isi."}”
      </p>
    </div>
    <div className="flex items-center mt-4">
      <img
        src={t?.testimoniImage || "/default-avatar.png"}
        alt={t?.author || "Author"}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border border-white/10"
      />
      <div className="ml-4">
        <h4 className="text-white font-semibold text-base sm:text-lg">
          {t?.author || "Anonim"}
        </h4>
        <p className="text-yellow-400 text-sm">⭐ {t?.rating || 0}/5</p>
      </div>
    </div>
  </motion.div>
);

const Testimonial = () => {
  const dispatch = useDispatch();
  const { testimonials = [], isLoading } = useSelector(
    (state) => state.testimonials || {}
  );

  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);

  return (
    <section
      id="testimonials"
      className="w-full bg-gradient-to-b from-black via-gray-900 to-black text-white py-24 sm:py-32 px-4 sm:px-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 tracking-tight"
          >
            Apa Kata Klien Kami
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto"
          >
            Kami bangga mendapatkan kepercayaan dari berbagai klien. Ini cerita mereka.
          </motion.p>
        </div>

        {/* Testimonials */}
        {isLoading ? (
          <p className="text-center text-gray-400">Memuat testimonial...</p>
        ) : testimonials.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada testimonial.</p>
        ) : (
          <Swiper
            modules={[Autoplay]}
            loop
            centeredSlides
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            spaceBetween={24}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="w-full"
          >
            {testimonials.map((t, index) => (
              <SwiperSlide key={index} className="h-auto">
                <TestimonialCard t={t} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default Testimonial;
