import PopUpWa from "../components/LandingPage/common/PopUpWa";
import Footer from "../components/LandingPage/Footer";
import Navbar from "../components/LandingPage/navbar/Navbar";

const LandingPageLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <PopUpWa />
      <Footer />
    </>
  );
};

export default LandingPageLayout;
