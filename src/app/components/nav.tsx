import Link from 'next/link'
import React from 'react'
import MavenLogo from "../assets/MavenLogo.png"
import Image from 'next/image'

type Props = {}

const Navbar = (props: Props) => {
  return (
    <nav className='absolute top-0 left-0 flex flex-row w-full py-10 bg-transparent z-50 overflow-hidden'>
      <div className='flex flex-3 mx-20 py-0 items-center'>
        <Image src={MavenLogo} alt="Maven Group logo" width={140} height={100} />
      </div>
      <div className='flex flex-1 flex-row mx-20 list-none text-white text-lg items-center justify-end'>
        <Link href="/about" className='px-5 nav-link nav-link-ltr'>About</Link>
        <Link href="/properties" className='px-5 nav-link nav-link-ltr'>Properties</Link>
        <Link href="/careers" className='px-5 nav-link nav-link-ltr'>Careers</Link>
        <Link href="/contact_us" className='px-5 nav-link nav-link-ltr'>Contact Us</Link>
      </div>
    </nav>
  )
}

export default Navbar