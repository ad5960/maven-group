"use client";
import Image from "next/image";
import Navbar from "../components/nav";

import Footer from "../components/footer";


export default function Page() {

  return (
    <>
      <Navbar />
      <div className="relative w-full h-[40vh]">
        <Image
          src="https://d2m41b1lxy01wm.cloudfront.net/services.jpg"
          alt="Los Angeles Night"
          layout="fill"
          objectFit="cover"
          className=" brightness-50"
        />
        <div className="absolute inset-0 flex justify-center items-center">
          <p className="text-white text-center text-4xl sm:text-5xl">Services</p>
        </div>
      </div>


      






      <div className="flex flex-col md:flex-row items-stretch md:space-x-0 mt-20">
  <div className="md:flex-1 w-full">
    <div className="relative w-full aspect-square xl:aspect-video">
      <Image
        src="https://d2m41b1lxy01wm.cloudfront.net/office.jpg"
        alt="Office"
        layout="fill"
        objectFit="cover"
        className="shadow-lg"
      />
    </div>
  </div>
  <div className="md:flex-1 w-full p-4 sm:p-10 bg-customBackground flex flex-col justify-center">
    <h1 className="text-lg sm:text-xl font-bold">Property Sales</h1>
    <p className="text-sm sm:text-md mt-2 sm:mt-4">
            With a keen understanding of the real estate market and an eye for detail,
            we specialize in property sales that deliver exceptional results for my clients.
            By leveraging comprehensive market analysis and strategic marketing techniques,
            we ensure properties are positioned to attract the right buyers. Whether buying or selling,
            we are committed to guiding clients through every step of the process,
            maximizing their return on investment and ensuring a smooth transaction.
    </p>
  </div>
</div>

<div className="flex flex-col md:flex-row items-stretch md:space-x-0">
  <div className="md:flex-1 w-full">
    <div className="relative w-full aspect-square xl:aspect-video">
      <Image
        src="https://d2m41b1lxy01wm.cloudfront.net/street.jpg"
        alt="Street"
        layout="fill"
        objectFit="cover"
        className="shadow-lg"
      />
    </div>
  </div>
  <div className="md:flex-1 w-full p-4 sm:p-10 bg-customBackground3 flex flex-col justify-center">
    <h1 className="text-lg sm:text-xl font-bold">Landlord Representation</h1>
    <p className="text-sm sm:text-md mt-2 sm:mt-4">
            As landlord representative, our goal is to protect and enhance the value of your investment.
            We offer tailored solutions for effective property management, tenant acquisition,
            and retention strategies. By focusing on maximizing occupancy rates and ensuring seamless
            tenant interactions, we help landlords maintain a profitable and hassle-free property
            ownership experience.
    
    </p>
  </div>
</div>

<div className="flex flex-col md:flex-row items-stretch md:space-x-0">
  <div className="md:flex-1 w-full">
    <div className="relative w-full aspect-square xl:aspect-video">
      <Image
        src="https://d2m41b1lxy01wm.cloudfront.net/shops.jpg"
        alt="Shops"
        layout="fill"
        objectFit="cover"
        className="shadow-lg"
      />
    </div>
  </div>
  <div className="md:flex-1 w-full p-4 sm:p-10 bg-customBackground4 flex flex-col justify-center">
    <h1 className="text-lg sm:text-xl font-bold">Tenant Representation</h1>
    <p className="text-sm sm:text-md mt-2 sm:mt-4">
            Finding the right space can be a daunting task, but with our expertise in tenant representation,
            the process becomes straightforward and stress-free. We work closely with tenants to understand
            their unique needs and negotiate lease terms that align with their goals.
            Our commitment to detail and market knowledge ensures that clients secure the ideal property
            in the perfect location, meeting both their budgetary and functional requirements.
    </p>
  </div>
</div>

      <Footer />
    </>
  )
}
