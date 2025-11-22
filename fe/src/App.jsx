import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

// Komponen Halaman
import Hero from "./components/LandingPage/Hero";
import Cyber from "./components/LandingPage/cyber";
import Network from "./components/LandingPage/network";
import Software from "./components/LandingPage/software";
import Service from "./components/LandingPage/Service";
import Kontak from "./components/LandingPage/kontak";
import Testimoni from "./components/LandingPage/Testimoni";
import LogoPartner from "./components/LandingPage/LogoPartner";
import IklanPopUp from "./components/LandingPage/IklanPopUp";
import Hero2 from "./components/LandingPage/Hero2";
import About from "./pages/LandingPage/About";
import Blog from "./pages/LandingPage/blog/Blog";
import BlogDetail from "./pages/LandingPage/blog/BlogDetail";
import ServicePage from "./pages/LandingPage/service/ServicePage";
import NotFound from "./components/LandingPage/notfound";
import LandingPageLayout from "./Layout/LandingPageLayout";

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    AOS.refresh(); // Penting untuk re-trigger animasi saat ganti halaman
  }, [pathname]);

  return null;
}

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false, // Animasi tetap bisa diputar kembali
      easing: "ease-in-out",
      offset: 120,
      mirror: true, // Animasi saat scroll ke atas juga
    });
  }, []);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <LandingPageLayout>
              <section data-aos="fade-up"><Hero /></section>
              <section data-aos="zoom-in-up"><Service /></section>
              <section data-aos="fade-right"><LogoPartner /></section>
              <section data-aos="flip-left"><Hero2 /></section>
              <section data-aos="fade-up"><Testimoni /></section>
              <IklanPopUp />
            </LandingPageLayout>
          }
        />
        <Route path="/CyberSecurity" element={<LandingPageLayout><section data-aos="fade-up-right"><Cyber /></section></LandingPageLayout>} />
        <Route path="/SoftwareDevelopment" element={<LandingPageLayout><section data-aos="fade-up-left"><Software /></section></LandingPageLayout>} />
        <Route path="/Network" element={<LandingPageLayout><section data-aos="fade-up"><Network /></section></LandingPageLayout>} />
        <Route path="/about" element={<LandingPageLayout><section data-aos="zoom-in"><About /></section></LandingPageLayout>} />
        <Route path="/service" element={<LandingPageLayout><section data-aos="flip-up"><ServicePage /></section></LandingPageLayout>} />
        <Route path="/contact" element={<LandingPageLayout><section data-aos="fade-up"><Kontak /></section></LandingPageLayout>} />
        <Route path="/blog" element={<LandingPageLayout><section data-aos="fade-up"><Blog /></section></LandingPageLayout>} />
        <Route path="/blog/:id" element={<LandingPageLayout><section data-aos="fade-up"><BlogDetail /></section></LandingPageLayout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
