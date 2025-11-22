
import Footer from "../components/LandingPage/Footer";
import Navbar from "../components/LandingPage/navbar/Navbar";

const LandingPageLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
 
      <Footer />
    </>
  );
};

export default LandingPageLayout;
