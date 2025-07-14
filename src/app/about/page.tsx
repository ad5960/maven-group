import Image from "next/image";
import Navbar from "../components/nav";
import Footer from "../components/footer";
import ProfilePhoto from "../assets/Profile.jpg";

export default function Page() {
  return (
    <>
      <Navbar />
      <div className="relative w-full h-[40vh] sm:h-[50vh]">
        {/* Set the height to 40% of viewport height, increase for smaller screens */}
        <Image
          src="https://d2m41b1lxy01wm.cloudfront.net/SantaMonica.jpg"
          alt="Los Angeles Night"
          layout="fill"
          objectFit="cover"
          className="opacity-90"
        />
        <div className="absolute inset-0 flex justify-center items-center">
          <p className="text-white text-center text-5xl sm:text-6xl">
            About Us
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center my-5 sm:my-10 mx-5 sm:mx-20">
        {/* Profile Photo */}
        <div className="w-48 h-48 rounded-full overflow-hidden">
          <Image
            src={ProfilePhoto}
            alt="Profile Photo"
            width={200}
            height={200}
            objectFit="cover"
          />
        </div>

        <p className="text-center text-base sm:text-xl mt-5">
          {/* Adjust text size for smaller screens */}
          <strong>Mavian</strong>, founded by <strong>Christopher Mavian</strong>, is a dynamic
          force in the commercial real estate industry. Born and raised in the vibrant city of Los
          Angeles, California, Christopher brings a wealth of knowledge and experience to the table.
          Graduating Magna Cum Laude with a bachelor&apos;s degree in Psychology from Cal State
          University Northridge, he distinguished himself as the president of the esteemed Psychology
          honor&apos;s society, Psi Chi.
          <br />
          <br />
          Driven by a passion for excellence, Christopher&apos;s diverse interests encompass
          CrossFit, hiking, fine art collection, and architectural design. His journey in real
          estate began with a focus on property management in prominent areas such as West
          Hollywood, West Los Angeles, Culver City, Marina Del Rey, and Beverly Hills. Transitioning
          seamlessly into commercial sales and leasing, Christopher honed his skills at Coldwell
          Banker Commercial WESTMAC before assuming the role of Managing Partner at The Hart Group,
          where he managed the Westside office and mentored numerous agents.
          <br />
          <br />
          Drawing from his extensive background, Christopher founded Mavian, a testament to his
          commitment to providing top-tier services in property valuation, landlord and tenant
          representation, site selection, and real property exchange counseling. With Christopher at
          the helm, Mavian is poised to redefine standards of excellence in the commercial real
          estate landscape.
          <br />
          <br />
        </p>
      </div>
      <Footer />
    </>
  );
}
