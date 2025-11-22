import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHeroes } from "../../app/data/heroSlice";
import DOMPurify from "dompurify";

const Hero = () => {
  const { heroes = [] } = useSelector((state) => state.hero || {});
  const dispatch = useDispatch();
  const [mediaSrc, setMediaSrc] = useState("/BG.mp4");
  const [isVideo, setIsVideo] = useState(true);

  useEffect(() => {
    dispatch(fetchHeroes());
  }, [dispatch]);

  const safeUrl = (url) => {
    const clean = DOMPurify.sanitize(url, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
    return /^(https?:\/\/|\/)/.test(clean) ? clean : "/BG.mp4";
  };

  useEffect(() => {
    if (!Array.isArray(heroes)) return;
    const activeHero = heroes.find((hero) => hero.isActive === true);
    if (activeHero?.heroImage) {
      const url = safeUrl(activeHero.heroImage);
      const ext = url.split(".").pop().toLowerCase();
      const isVid = ["mp4", "webm", "ogg"].includes(ext);
      const isImg = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
      setMediaSrc(url);
      setIsVideo(isVid || !isImg); // fallback ke video jika ekstensi tidak dikenal
    }
  }, [heroes]);

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {isVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover brightness-75 contrast-100"
          >
            <source src={mediaSrc} type="video/mp4" />
          </video>
        ) : (
          <img
            src={mediaSrc}
            alt="Hero Background"
            className="w-full h-full object-cover brightness-75 contrast-100"
            loading="lazy"
          />
        )}

        {/* Overlay: gradasi atas ke bawah + gradasi gelap di bawah */}
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />
          <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-black/90 to-transparent" />
        </>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 sm:px-10 text-center">
        <h1
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-md"
          data-aos="fade-up"
        >
          Xeranet Solutions Technology
        </h1>

        <p
          className="text-base sm:text-lg lg:text-xl text-gray-200 max-w-2xl mt-6 leading-relaxed drop-shadow"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Kami menyediakan solusi digital untuk mempercepat perkembangan Anda dengan fokus pada keamanan dan efisiensi operasional.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto justify-center"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <a
            href="/contact"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-md hover:scale-105 text-center"
          >
            Kontak Kami
          </a>
          <a
            href="/service"
            className="border border-white hover:bg-white hover:text-black text-white font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-md hover:scale-105 text-center"
          >
            Layanan Kami
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
