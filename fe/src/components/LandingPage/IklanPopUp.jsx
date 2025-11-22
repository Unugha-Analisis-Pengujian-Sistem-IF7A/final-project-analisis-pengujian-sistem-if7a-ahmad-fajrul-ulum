/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { fetchIklan } from "../../app/data/iklanSlice";
import DOMPurify from "dompurify";

const IklanPopUp = () => {
  const dispatch = useDispatch();
  const { iklan = [] } = useSelector((state) => state.iklan);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchIklan());
  }, [dispatch]);

  useEffect(() => {
    const shownAt = localStorage.getItem("popupShownAt");

    const showPopup = () => {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);

      return () => clearTimeout(timer);
    };

    if (shownAt) {
      const elapsed = Date.now() - parseInt(shownAt, 10);
      const FIVE_MINUTES = 5 * 60 * 1000;

      if (elapsed > FIVE_MINUTES) {
        localStorage.removeItem("popupShownAt");
        showPopup();
      }
    } else {
      showPopup();
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("popupShownAt", Date.now().toString());
    setIsOpen(false);
  };

  const activePopUp = iklan.find((p) => p.isActive === true);
  const safeImageURL = activePopUp?.iklanImage
    ? DOMPurify.sanitize(activePopUp.iklanImage, {
        ALLOWED_URI_REGEXP: /^(https?|data):/i,
      })
    : null;

  if (!safeImageURL) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-full h-full bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            className="relative w-[90%] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl rounded-xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 z-10"
            >
              <AiOutlineClose />
            </button>

            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <img
                src={safeImageURL}
                alt="popup-iklan"
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IklanPopUp;
