import PopUpWa from "../components/LandingPage/common/PopUpWa";
import Footer from "../components/LandingPage/Footer";
import Navbar from "../components/LandingPage/navbar/Navbar";

import PropTypes from "prop-types";

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

LandingPageLayout.propTypes = {
  children: PropTypes.node,
};

export default LandingPageLayout;
