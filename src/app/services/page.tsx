"use client";
import Image from "next/image";
import Navbar from "../components/nav";
import SantaMonica from "../assets/SantaMonica.jpg";
import officeImg from "../assets/office.jpg";
import shopsImg from "../assets/shops.jpg";
import streetImg from "../assets/street.jpg";
import Footer from "../components/footer";

export default function Page() {

  return (
    <>
      <Navbar />
      <div className="relative w-full h-[40vh]">
        <Image
          src={SantaMonica}
          alt="Los Angeles Night"
          layout="fill"
          objectFit="cover"
          className="opacity-90"
        />
        <div className="absolute inset-0 flex justify-center items-center">
          <p className="text-white text-center text-4xl sm:text-5xl">Services</p>
        </div>
      </div>


      






      <div className="flex flex-col md:flex-row items-center md:space-x-4 mt-20">
        <div className="md:flex-1 w-full">
          <Image
            src={officeImg}
            width={600}
            height={300}
            alt="Office"
            layout="responsive"
          />
        </div>
        <div className="md:flex-1 mt-4 md:mt-0 w-full">
          <h1 className="text-lg sm:text-xl font-bold">Heading Text</h1>
          <p className="text-sm sm:text-md">
            This is some paragraph text content that will wrap to the next line if it gets too long.
            Add more content here to see how it wraps or expands. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>

      



      <div className="flex flex-col md:flex-row-reverse items-center md:space-x-reverse md:space-x-4 p-4">
        <div className="md:flex-1 w-full">
          <Image
            src={streetImg}
            width={600}
            height={300}
            alt="Street"
            layout="responsive"
          />
        </div>
        <div className="md:flex-1 mt-4 md:mt-0 w-full">
          <h1 className="text-lg sm:text-xl font-bold">Heading Text</h1>
          <p className="text-sm sm:text-md">
            This is some paragraph text content that will wrap to the next line if it gets too long.
            Add more content here to see how it wraps or expands. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>

      






      <div className="flex flex-col md:flex-row items-center md:space-x-4 p-4">
        <div className="md:flex-1 w-full">
          <Image
            src={shopsImg}
            width={600}
            height={300}
            alt="Shops"
            layout="responsive"
          />
        </div>
        <div className="md:flex-1 mt-4 md:mt-0 w-full">
          <h1 className="text-lg sm:text-xl font-bold">Heading Text</h1>
          <p className="text-sm sm:text-md">
            This is some paragraph text content that will wrap to the next line if it gets too long.
            Add more content here to see how it wraps or expands. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>
      <Footer />
    </>
  )
}
