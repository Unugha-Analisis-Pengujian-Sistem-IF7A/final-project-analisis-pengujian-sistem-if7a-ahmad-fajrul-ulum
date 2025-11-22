/* eslint-disable no-unused-vars */
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black bg-opacity-80 backdrop-blur-md shadow-inner border-t border-white/10 text-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Logo & Social Media */}
        <div>
          <img
            src="/logo_F/logo.png"
            alt="Xeranet Logo"
            className="w-28 mb-5"
            loading="lazy"
          />
          <div className="flex gap-4 mt-4">
            {[FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaTwitter].map(
              (Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-red-400 text-xl transition-colors"
                >
                  <Icon />
                </a>
              )
            )}
          </div>
        </div>

        {/* Company */}
        <div>
          <h5 className="text-lg font-semibold mb-4">Company</h5>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/about" className="hover:text-red-400">
                About Us
              </a>
            </li>
            <li>
              <a href="/blog" className="hover:text-red-400">
                Blog
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-red-400">
                Contact Us
              </a>
            </li>
            <li>
              <a href="/testimoni" className="hover:text-red-400">
                Testimoni
              </a>
            </li>
          </ul>
        </div>

        {/* Solutions */}
        <div>
          <h5 className="text-lg font-semibold mb-4">Solutions</h5>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-red-400">
                Fraud Management
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-400">
                DevSecOps
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-400">
                Security Operations Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-400">
                Data Protection
              </a>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h5 className="text-lg font-semibold mb-4">Services</h5>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#service" className="hover:text-red-400">
                Penetration Testing
              </a>
            </li>
            <li>
              <a href="#service" className="hover:text-red-400">
                Security Compliance
              </a>
            </li>
            <li>
              <a href="#service" className="hover:text-red-400">
                Threat Hunting
              </a>
            </li>
            <li>
              <a href="#service" className="hover:text-red-400">
                Digital Forensics
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Xeranet. All Rights Reserved.
      </div>
    </footer>
  );
}
