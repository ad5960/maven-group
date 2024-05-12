"use client";
import Image from "next/image";
import Navbar from "../components/nav";
import SantaMonica from "../assets/SantaMonica.jpg";
import officeImg from "../assets/office.jpg";
import shopsImg from "../assets/shops.jpg";
import streetImg from "../assets/street.jpg";
import { useInView } from 'react-intersection-observer'; // Import the hook

export default function Page() {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0  // Trigger when 50% of the element is in view
    });

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
                    <p className="text-white text-center text-5xl">Services</p>
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:space-x-4 p-4">
      <div className="md:flex-1">
        <Image 
          src={officeImg} // Change to your image path
          width={600} // Adjust as needed
          height={300} // Adjust as needed
          alt="Descriptive Alt Text"
        />
      </div>
      <div className="md:flex-1 mt-4 md:mt-0">
        <h1 className="text-xl font-bold">Heading Text</h1>
        <p className="text-md">
          This is some paragraph text content that will wrap to the next line if it gets too long.
          Add more content here to see how it wraps or expands. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
            </div>
            
            <div className="flex flex-col md:flex-row-reverse items-center md:space-x-reverse md:space-x-4 p-4">
      <div className="md:flex-1">
        <Image 
          src={streetImg} // Change to your image path
          width={600} // Adjust as needed
          height={300} // Adjust as needed
          alt="Descriptive Alt Text"
        />
      </div>
      <div className="md:flex-1 mt-4 md:mt-0">
        <h1 className="text-xl font-bold">Heading Text</h1>
        <p className="text-md">
          This is some paragraph text content that will wrap to the next line if it gets too long.
          Add more content here to see how it wraps or expands. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:space-x-4 p-4">
      <div className="md:flex-1">
        <Image 
          src={shopsImg} // Change to your image path
          width={600} // Adjust as needed
          height={300} // Adjust as needed
          alt="Descriptive Alt Text"
        />
      </div>
      <div className="md:flex-1 mt-4 md:mt-0">
        <h1 className="text-xl font-bold">Heading Text</h1>
        <p className="text-md">
          This is some paragraph text content that will wrap to the next line if it gets too long.
          Add more content here to see how it wraps or expands. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
            </div>
        </>
    )
}
