import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/nav";
import SantaMonica from "../assets/SantaMonica.jpg"
export default function Page() {
    return (
        <>
            <Navbar />
            <div className="relative w-full h-[40vh]"> {/* Set the height to 50% of viewport height */}
                <Image
                    src={SantaMonica}
                    alt="Los Angeles Night"
                    layout="fill"
                    objectFit="cover"
                    className="opacity-90"
                />
                <div className="absolute inset-0 flex justify-center items-center">
                    <p className="text-white text-center text-5xl">Careers</p>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center p-4 m-20">
      <div className="md:flex-1 md:mr-8"> {/* Right margin to add space between the two divs */}
        <h1 className="text-xl font-bold">Left Heading</h1>
        <p className="text-md">
          This is some paragraph text on the left side. It can wrap to the next line as needed.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </p>
      </div>
      <div className="md:flex-1 md:ml-8"> {/* Left margin to add space between the two divs */}
        <h1 className="text-xl font-bold">Right Heading</h1>
        <p className="text-md">
          This is some paragraph text on the right side. Similarly, this will wrap when required.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat.
        </p>
      </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center p-4 m-20">
      <div className="md:flex-1 md:mr-8"> {/* Right margin to add space between the two divs */}
        <h1 className="text-xl font-bold">Left Heading</h1>
        <p className="text-md">
          This is some paragraph text on the left side. It can wrap to the next line as needed.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </p>
      </div>
      <div className="md:flex-1 md:ml-8"> {/* Left margin to add space between the two divs */}
        <h1 className="text-xl font-bold">Right Heading</h1>
        <p className="text-md">
          This is some paragraph text on the right side. Similarly, this will wrap when required.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat.
        </p>
      </div>
    </div>
        </>
    )
}
