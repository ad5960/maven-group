import Image from "next/image";
import Navbar from "../components/nav";
import SantaMonica from "../assets/SantaMonica.jpg";
import ContactForm from "../components/contact_form";
import Footer from "../components/footer";
import { CardComponent } from "../components/card";

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
                    <p className="text-white text-center text-4xl md:text-5xl">Contact Us</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row w-full justify-center mt-10 mb-20 px-4 md:px-10">
    <div className="flex flex-col mx-4 lg:mx-10 mb-10 lg:mb-0 w-full lg:w-1/2">
        <p className="text-2xl md:text-3xl font-bold">General Inquiries</p>
        <div >
            <p className="flex flex-1 font-bold">Email: chris@mavengroups.com</p>
            
        </div>

        <p className="my-4">1515 Sepulveda Boulevard<br />
            Los Angeles, CA 90025</p>

        <p className="text-2xl md:text-3xl font-bold">Executive Team</p>
        <p className="text-lg md:text-xl font-semibold mt-4">Chris Mavian</p>
        <p className="flex">chris@mavengroups.com</p>
    </div>
    <div className="flex w-full lg:w-1/2 lg:mx-10">
        <ContactForm />
    </div>
</div>

            <Footer />
        </>
    );
}
