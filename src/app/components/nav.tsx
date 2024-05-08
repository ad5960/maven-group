"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import BlackMavenLogo from "../assets/MavenLogo.png"
import WhiteMavenLogo from "../assets/Maven_white.png"
import Image from 'next/image'

type Props = {}

const Navbar = (props: Props) => {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isPropertiesPage = pathname === '/properties';
  
  return (
    <nav className={`fixed top-0 left-0 flex flex-row w-full py-10 ${scrolled || isPropertiesPage? 'bg-white text-black' : 'bg-transparent text-white'} z-50 overflow-hidden`}>
      <div className='flex flex-3 mx-20 my-[-30px]'>
        <Image src={scrolled || isPropertiesPage ? BlackMavenLogo : WhiteMavenLogo} alt="Maven Group logo" width={140} height={100} />
      </div>
      <div className='flex flex-1 flex-row justify-end mx-20 list-none text-lg'>
        <Link href="/" className='px-5'>Home</Link>
        <Link href="/about" className='px-5'>About</Link>
        <Link href="/properties" className='px-5'>Properties</Link>
        <Link href="/services" className='px-5'>Services</Link>
        <Link href="/careers" className='px-5'>Careers</Link>
        <Link href="/contact_us" className='px-5'>Contact Us</Link>
      </div>
    </nav>
  )
}

export default Navbar