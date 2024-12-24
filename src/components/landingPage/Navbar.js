// Code was written by Muhammad Sindida Hilmy

import { Link as ScrollLink } from 'react-scroll';
import React, { useState, useEffect } from 'react';
import { FaBars, FaChevronDown } from 'react-icons/fa';
import "../landingPage/css/Navbar.css";
import libraryImage from '../../assets/img/logo.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className={`navbar fixed top-0 w-full z-10 transition duration-500 ease-in-out ${isScrolled ? 'bg-white shadow-lg scrolled' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button onClick={toggleNavbar} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <FaBars className="block h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <img className="h-8 w-8" src={libraryImage} alt="Logo" />
              <span className={`ml-2 font-bold text-lg ${isScrolled ? 'text-gray-700' : 'text-white'}`}>SMANBA</span>
            </div>
        
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                <ScrollLink 
                  to="opac" 
                  smooth={true} 
                  duration={500} 
                  className={`nav-link px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${isScrolled ? 'text-gray-700' : 'text-white'}`}
                >
                  Home
                </ScrollLink>
                <ScrollLink 
                  to="book" 
                  smooth={true} 
                  duration={500} 
                  className={`nav-link px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${isScrolled ? 'text-gray-700' : 'text-white'}`}
                >
                  Book
                </ScrollLink>
                <ScrollLink 
                  to="rules" 
                  smooth={true} 
                  duration={500} 
                  className={`nav-link px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${isScrolled ? 'text-gray-700' : 'text-white'}`}
                >
                  Rules
                </ScrollLink>
                <ScrollLink 
                  to="feedback" 
                  smooth={true} 
                  duration={500} 
                  className={`nav-link px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${isScrolled ? 'text-gray-700' : 'text-white'}`}
                >
                  Feedback
                </ScrollLink>
                <div className="relative">
                  <button onClick={toggleDropdown} className={`flex items-center nav-link px-3 py-2 rounded-md text-sm font-medium ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                    Member Area <FaChevronDown className="ml-1" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg z-20">
                      <a href="/login" className="dropdown-item block px-4 py-2 text-sm hover:bg-gray-200">Login</a>
                      <a href="/register" className="dropdown-item block px-4 py-2 text-sm hover:bg-gray-200">Register</a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`sm:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <ScrollLink 
            to="opac" 
            smooth={true} 
            duration={500} 
            className={`text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${isScrolled ? 'text-gray-700' : 'text-white'}`}
          >
            Home
          </ScrollLink>
          <ScrollLink 
            to="book" 
            smooth={true} 
            duration={500} 
            className={`text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${isScrolled ? 'text-gray-700' : 'text-white'}`}
          >
            Book
          </ScrollLink>
          <div className="relative">
            <button onClick={toggleDropdown} className={`flex items-center w-full text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
              Member Area <FaChevronDown className="ml-1" />
            </button>
            {isDropdownOpen && (
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="/login" className={`text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium ${isScrolled ? 'text-gray-700' : 'text-white'}`}>Login</a>
                <a href="/register" className={`text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium ${isScrolled ? 'text-gray-700' : 'text-white'}`}>Register</a>
              </div>
            )}
          </div>
          <ScrollLink 
            to="rules" 
            smooth={true} 
            duration={500} 
            className={`text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${isScrolled ? 'text-gray-700' : 'text-white'}`}
          >
            Rules
          </ScrollLink>
          <ScrollLink 
            to="feedback" 
            smooth={true} 
            duration={500} 
            className={`text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${isScrolled ? 'text-gray-700' : 'text-white'}`}
          >
            Feedback
          </ScrollLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;