"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import BlackMavenLogo from "../assets/MavenLogo.png";
import WhiteMavenLogo from "../assets/Maven_white.png";
import Image from "next/image";

type Props = {};

const Navbar = (props: Props) => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const mobileMenu = document.getElementById("mobile-menu");
      const hamburgerButton = document.getElementById("hamburger-button");
      
      if (mobileMenuOpen && 
          mobileMenu && 
          !mobileMenu.contains(target) && 
          hamburgerButton && 
          !hamburgerButton.contains(target)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isPropertiesPage = pathname.startsWith("/properties");

  return (
    <nav
      className={`fixed top-0 left-0 flex items-center w-full py-6 px-8 md:px-16 ${scrolled || isPropertiesPage ? "bg-white text-gray-800 shadow-sm" : "bg-transparent text-white"
        } z-50 transition-all duration-300`}
    >
      <div className="flex-shrink-0">
        <Image
          src={scrolled || isPropertiesPage ? BlackMavenLogo : WhiteMavenLogo}
          alt="Maven Group logo"
          width={140}
          height={100}
        />
      </div>
      <div className="ml-auto hidden md:flex items-center space-x-12 text-sm tracking-wide uppercase">
        <Link 
          href="/" 
          className="font-light hover:underline transition-all duration-200"
        >
          Home
        </Link>
        <Link 
          href="/about" 
          className="font-light hover:underline transition-all duration-200"
        >
          About
        </Link>
        <Link 
          href="/properties" 
          className="font-light hover:underline transition-all duration-200"
        >
          Properties
        </Link>
        <Link 
          href="/services" 
          className="font-light hover:underline transition-all duration-200"
        >
          Services
        </Link>
        <Link 
          href="/careers" 
          className="font-light hover:underline transition-all duration-200"
        >
          Careers
        </Link>
        <Link 
          href="/contact_us" 
          className="font-light hover:underline transition-all duration-200"
        >
          Contact
        </Link>
      </div>
      <div className="ml-auto md:hidden flex items-center">
        <button
          id="hamburger-button"
          type="button"
          className={`text-${scrolled || isPropertiesPage ? 'black' : 'white'} focus:outline-none p-2 rounded-lg hover:bg-black/10 transition-all duration-200`}
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? (
            // X icon when menu is open
            <svg
              className="w-6 h-6 transition-transform duration-200 rotate-90"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          ) : (
            // Hamburger icon when menu is closed
            <svg
              className="w-6 h-6 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          )}
        </button>
      </div>
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-40" />
      )}
      
      <div
        id="mobile-menu"
        className={`${
          mobileMenuOpen 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-4 opacity-0 pointer-events-none'
        } absolute top-full left-0 w-full bg-white/95 backdrop-blur-md text-black md:hidden flex-col items-center py-4 shadow-2xl border-t border-gray-200 transition-all duration-300 ease-out z-50`}
      >
        <div className="flex flex-col space-y-1 px-4">
          <Link 
            href="/" 
            className="block px-4 py-3 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium text-gray-800 hover:text-black" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className="block px-4 py-3 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium text-gray-800 hover:text-black" 
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            href="/properties" 
            className="block px-4 py-3 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium text-gray-800 hover:text-black" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Properties
          </Link>
          <Link 
            href="/services" 
            className="block px-4 py-3 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium text-gray-800 hover:text-black" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Services
          </Link>
          <Link 
            href="/careers" 
            className="block px-4 py-3 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium text-gray-800 hover:text-black" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Careers
          </Link>
          <Link 
            href="/contact_us" 
            className="block px-4 py-3 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium text-gray-800 hover:text-black" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
