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

  const isPropertiesPage = pathname.startsWith("/properties");

  return (
    <nav
      className={`fixed top-0 left-0 flex items-center w-full py-5 px-4 md:px-10 ${scrolled || isPropertiesPage ? "bg-white text-black" : "bg-transparent text-white"
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
      <div className="ml-auto hidden md:flex space-x-5 text-lg">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/about" className="hover:underline">About</Link>
        <Link href="/properties" className="hover:underline">Properties</Link>
        <Link href="/services" className="hover:underline">Services</Link>
        <Link href="/careers" className="hover:underline">Careers</Link>
        <Link href="/contact_us" className="hover:underline">Contact Us</Link>
      </div>
      <div className="ml-auto md:hidden flex items-center">
        <button
          type="button"
          className={`text-${scrolled || isPropertiesPage ? 'black' : 'white'} focus:outline-none`}
          onClick={() => {
            const menu = document.getElementById("mobile-menu");
            menu?.classList.toggle("hidden");
          }}
        >
          <svg
            className="w-6 h-6"
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
        </button>
      </div>
      <div
        id="mobile-menu"
        className="hidden absolute top-full left-0 w-full bg-white text-black md:hidden flex-col items-center py-2"
      >
        <Link href="/" className="block px-5 py-2 hover:bg-gray-100">Home</Link>
        <Link href="/about" className="block px-5 py-2 hover:bg-gray-100">About</Link>
        <Link href="/properties" className="block px-5 py-2 hover:bg-gray-100">Properties</Link>
        <Link href="/services" className="block px-5 py-2 hover:bg-gray-100">Services</Link>
        <Link href="/careers" className="block px-5 py-2 hover:bg-gray-100">Careers</Link>
        <Link href="/contact_us" className="block px-5 py-2 hover:bg-gray-100">Contact Us</Link>
      </div>
    </nav>
  );
};

export default Navbar;
