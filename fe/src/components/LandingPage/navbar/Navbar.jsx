import React, { useState, useEffect, useRef } from "react";
import logo from "./assets/logo.png";
import { FaFacebook, FaTwitter, FaInstagram, FaTimes } from "react-icons/fa";
import DOMPurify from "dompurify";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userIP, setUserIP] = useState("Loading...");
  const menuRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch("https://api64.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setUserIP(data.ip))
      .catch(() => setUserIP("Unavailable"));
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const timeStr = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <>
      {/* Navbar */}
<nav className="fixed top-0 left-0 w-full bg-black bg-opacity-80 backdrop-blur-md shadow-lg z-[1000] py-3">
  <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 md:px-12">
    {/* Logo */}
    <a href="/" className="flex items-center">
      <img
        src={logo}
        alt="Logo"
    className="h-6 sm:h-7 md:h-8 lg:h-9 w-auto object-contain transition-all"
      />
    </a>

    {/* Menu Button */}
    <button
      onClick={toggleMenu}
      aria-label="Open Menu"
      className="text-white text-3xl md:text-4xl hover:text-red-500 transition-colors duration-200"
    >
      ≡
    </button>
  </div>
</nav>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[1001] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Sidebar */}
        <aside
          ref={menuRef}
          className={`fixed top-0 right-0 h-screen bg-[rgba(100,99,99,0.2)] backdrop-blur-md text-white z-[1002] p-5 pt-10 overflow-y-auto flex flex-col transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } w-[500px] max-md:w-[75vw]`}
        >
          {/* Close Button */}
          <button
            onClick={toggleMenu}
            aria-label="Close Menu"
            className="absolute top-[30px] right-[30px] max-md:top-[15px] max-md:right-[15px] text-gray-400 text-[1.8rem] hover:text-white"
          >
            <FaTimes />
          </button>

          {/* Header */}
          <div className="mt-[30px] max-md:mt-[24px] pl-[50px] text-left">

            <p className="text-[2rem] font-bold max-sm:text-[1.4rem]">{timeStr}</p>
            <p
              className="text-sm text-gray-300 max-sm:text-[0.9rem]"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(`IP: ${userIP}`),
              }}
            />
          </div>

          {/* Menu Links */}
          <ul className="mt-10 mb-8 pl-[30px] space-y-4">
            {[
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Services", href: "/service" },
              { label: "Bloger", href: "/blog" },
              { label: "Contact", href: "/contact" },
              { label: "Investor", href: "/#" },
              { label: "Mitra", href: "/#" },
            ].map((item, index) => (
              <li
                key={index}
                className="border-b border-[#4a4a4a91] w-[88%] mx-auto py-3"
              >
                <a
                  href={item.href}
                  className="flex justify-between items-center text-white hover:text-red-500 text-[1.2rem] max-sm:text-[1rem]"
                >
                  <span>{item.label}</span>
                  <span className="font-bold text-[1.4rem]">+</span>
                </a>
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div className="mt-4 pt-5 border-t border-white/10 pl-[50px]">
            <img
              src={logo}
              alt="Footer Logo"
              className="h-[25px] max-sm:h-[20px] mb-2"
            />
            <div className="flex space-x-4 mt-2">
              <a href="#" className="text-white text-[1.4rem] hover:text-red-500 max-sm:text-[1rem]">
                <FaFacebook />
              </a>
              <a href="#" className="text-white text-[1.4rem] hover:text-red-500 max-sm:text-[1rem]">
                <FaTwitter />
              </a>
              <a href="#" className="text-white text-[1.4rem] hover:text-red-500 max-sm:text-[1rem]">
                <FaInstagram />
              </a>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Navbar;
