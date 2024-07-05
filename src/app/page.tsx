import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/nav";
import Beach from "./assets/beach.jpg"
import Footer from "./components/footer";

export default function Page() {
  return (
    <div className="relative">
      <Navbar />
      <div className="w-full h-screen relative">
        <Image src={Beach} alt="Los Angeles Night" layout="fill" objectFit="cover" className="filter brightness-75" />
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <p className="text-white text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold">
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">maven</span>
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">: noun</span>
            <br />
            <span className="text-lg sm:text-2xl md:text-2xl lg:text-3xl typing-effect-maven">ma-ven</span>
            <br />
            <span className="text-sm sm:text-md md:text-base lg:text-2xl typing-effect">: One who is experienced or knowledgeable: EXPERT</span>
          </p>
        </div>
      </div>
      
      <div className="flex flex-col justify-center items-center py-10 sm:py-20">
        <div className="flex flex-col max-w-6xl px-5 sm:px-10">
          <div className="flex flex-col sm:flex-row justify-center items-center">
            <Image src={Beach} alt="About Us Image" width={400} height={200} className="w-full sm:w-1/2 mx-auto mb-5 sm:mr-10" />
            <div className="w-full sm:w-1/2 text-center sm:text-left">
              <p className="text-3xl sm:text-4xl font-normal mb-5">About Us</p>
              <p className="text-lg sm:text-xl text-justify">
                Founded by Christopher Mavian, Maven Group is a premier commercial real estate firm rooted in Los Angeles, offering unparalleled expertise in property management, sales, leasing, and comprehensive counseling services. With a background in psychology and a track record of success, Christopher leads a dedicated team committed to delivering exceptional results and personalized solutions for clients across diverse sectors.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col max-w-6xl px-5 sm:px-10 mt-10 sm:mt-20">
          <div className="flex flex-col sm:flex-row justify-center items-center">
            <Image src={Beach} alt="Services Image" width={400} height={200} className="w-full sm:w-1/2 mx-auto order-none sm:order-1" />

            <div className="w-full sm:w-1/2 text-center sm:text-left lg:mr-5 mb-5">
              <p className="text-3xl sm:text-4xl font-normal my-5">Services</p>
              <p className="text-lg sm:text-xl text-justify">
                Maven Group specializes in providing comprehensive services tailored to the diverse needs of clients in the commercial real estate market. Our expert team excels in facilitating property sales, ensuring seamless transactions and maximizing returns for sellers. Additionally, we offer dedicated landlord and tenant representation, fostering mutually beneficial relationships and facilitating successful lease agreements.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}