// Code was written by Muhammad Sindida Hilmy

import React from 'react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import Logo from "../../assets/img/logo.png";

const FooterSection = () => {
  return (
    <footer className="relative bg-gray-800 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between">
    
        <div className="mb-8 md:mb-0">
          <h2 className="text-lg font-semibold mb-4">Sosial Media</h2>
          <ul className="flex space-x-4">
            <li>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                <FaFacebook className="h-8 w-8" />
                <span className="block text-xs text-gray-300 mt-1">smanbalibrary</span>
              </a>
            </li>

            <li>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-600">
                <FaInstagram className="h-8 w-8" />
                <span className="block text-xs text-gray-300 mt-1">smanba_library</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="mb-8 md:mb-0">
          <h2 className="text-lg font-semibold mb-4">Contact Us</h2>
          <p className="text-sm text-gray-300">Email: smanbalibrary@gmail.com</p>
          <p className="text-sm text-gray-300">WhatsApp: 0812-1212-4554</p>
        </div>

        <div className="mb-8 md:mb-0">
          <h2 className="text-lg font-semibold mb-4">Working Hours</h2>
          <p className="text-sm text-gray-300">Monday - Friday: 7AM - 4PM</p>
          <p className="text-sm text-gray-300">Saturday - Sunday: Closed</p>
        </div>

        <div className="flex-shrink-0 mb-8 md:mb-0">
          <img src={Logo} alt="Logo" className="h-12 ml-3" />
          <span className="text-white-900 font-bold text-lg">SMANBA</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <h2 className="text-lg font-semibold mb-4">Alamat</h2>
        <p className="text-sm text-gray-300">
          Jl. Raya Bantarkawung No.15, Cilakar, Pangebatan, Kec. Bantarkawung, Kabupaten Brebes, Jawa Tengah 52273
        </p>
      </div>
      
      <div className="absolute bottom-2 inset-x-0 text-center text-gray-500 text-xs pb-2">
      © 2024 imyproject. All rights reserved
      </div>
    </footer>
  );
};

export default FooterSection;