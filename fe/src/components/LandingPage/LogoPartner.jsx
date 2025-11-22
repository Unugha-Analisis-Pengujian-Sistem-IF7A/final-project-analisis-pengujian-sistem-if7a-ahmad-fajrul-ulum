import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchLogoPTs } from "../../app/data/logoPTSlice";
import DOMPurify from "dompurify";

const LogoPartner = () => {
  const { logoPTs = [] } = useSelector((state) => state.logoPTs || {});
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLogoPTs());
  }, [dispatch]);

  const shouldLoop = logoPTs.length > 4;

  return (
    <section className="bg-black py-20 px-4 sm:px-6 relative z-10">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-yellow-400 tracking-tight">
          Our Trusted Partners
        </h2>
        <p className="mt-4 text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
          Kami berkolaborasi dengan perusahaan terbaik untuk memberikan solusi Teknologi terbaik.
        </p>
      </div>

      {logoPTs.length === 0 ? (
        <p className="text-center text-gray-500">Belum ada logo mitra.</p>
      ) : (
        <Swiper
          modules={[Autoplay]}
          loop={shouldLoop}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          spaceBetween={30}
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 20 },
            640: { slidesPerView: 3, spaceBetween: 30 },
            1024: { slidesPerView: 4, spaceBetween: 40 },
          }}
          className="w-full max-w-6xl mx-auto"
        >
          {logoPTs.map((logo, index) => {
            const safeImageURL = logo.logoPTImage
              ? DOMPurify.sanitize(logo.logoPTImage, {
                  ALLOWED_URI_REGEXP: /^(https?|data):/i,
                })
              : null;

            if (!safeImageURL) return null;

            return (
              <SwiperSlide
                key={index}
                className="flex justify-center items-center"
              >
                <div className="p-4 transition duration-500 transform hover:scale-105">
                  <img
                    src={safeImageURL}
                    alt={`Logo ${index + 1}`}
                    className="h-16 sm:h-20 object-contain grayscale hover:grayscale-0 transition-all duration-500 ease-in-out"
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </section>
  );
};

export default LogoPartner;
