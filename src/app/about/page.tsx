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
                    <p className="text-white text-center text-5xl">About Us</p>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center my-10">
                <p className="text-justify w-1/2 text-center text-xl">
                    <strong>Maven Group</strong>, founded by <strong>Christopher Mavian</strong>, is a dynamic force in the commercial real estate industry. Born and raised in the vibrant city of Los Angeles, California, Christopher brings a wealth of knowledge and experience to the table. Graduating Magna Cum Laude with a bachelor's degree in Psychology from Cal State University Northridge, he distinguished himself as the president of the esteemed Psychology honor's society, Psi Chi. <br /><br />

                    Driven by a passion for excellence, Christopher's diverse interests encompass CrossFit, hiking, fine art collection, and architectural design. His journey in real estate began with a focus on property management in prominent areas such as West Hollywood, West Los Angeles, Culver City, Marina Del Rey, and Beverly Hills. Transitioning seamlessly into commercial sales and leasing, Christopher honed his skills at Coldwell Banker Commercial WESTMAC before assuming the role of Managing Partner at The Hart Groups, where he managed the Westside office and mentored numerous agents.<br /><br />

                    Drawing from his extensive background, Christopher founded Maven Group, a testament to his commitment to providing top-tier services in property valuation, landlord and tenant representation, site selection, and real property exchange counseling. With Christopher at the helm, Maven Group is poised to redefine standards of excellence in the commercial real estate landscape.<br /><br />
                </p>
            </div>
        </>
    )
}
