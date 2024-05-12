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
        </>
    )
}
