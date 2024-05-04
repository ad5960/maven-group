import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/nav";
import LANight from "./assets/beach.jpg"
export default function Page() {
  return (
    <div>
      <div className="w-full h-screen max-h-screen overflow-hidden">
      <Navbar/>
  <Image src={LANight} alt="Los Angeles Night" layout="responsive" className="filter brightness-75"/>
  <div className="absolute inset-0 flex justify-center items-center">
    <p className="text-white text-center text-2xl font-extrabold">
      <span className="text-6xl">maven</span>
      <span className="text-2xl"> noun </span><br />
      <span className="text-3xl typing-effect-maven"> ma-ven </span><br/> 
      variants or less commonly known as mavin <br/>
      <span className="typing-effect">: One who is experienced or knowledgeable: EXPERT</span>
    </p>
  </div>
</div>
      <div className="w-full flex flex-col justify-center items-center">
        <div className="flex flex-row justify-between items-center max-w-6xl py-10">
          <Image src={LANight} alt="About Us Image" width={500} height={200} className="mx-10" />
          <div className="flex flex-col w-full px-10">
            <p className="text-4xl font-normal">About Us</p><br/>
            <p className="text-xl w-full overflow-hidden overflow-ellipsis text-justify">Founded by Christopher Mavian, Maven Group is a premier commercial real estate firm rooted in Los Angeles, offering unparalleled expertise in property management, sales, leasing, and comprehensive counseling services. With a background in psychology and a track record of success, Christopher leads a dedicated team committed to delivering exceptional results and personalized solutions for clients across diverse sectors.</p>
          </div>
        </div>
        <div className="flex flex-row justify-between items-center max-w-6xl py-10 my-10">
          <div className="flex flex-col w-full px-10">
            <p className="text-4xl font-normal">Services</p><br />
            <p className="text-xl w-full overflow-hidden overflow-ellipsis text-justify">Maven Group specializes in providing comprehensive services tailored to the diverse needs of clients in the commercial real estate market. Our expert team excels in facilitating property sales, ensuring seamless transactions and maximizing returns for sellers. Additionally, we offer dedicated landlord and tenant representation, fostering mutually beneficial relationships and facilitating successful lease agreements.</p>
          </div>
          <Image src={LANight} alt="Services Image" width={500} height={200} className="mx-10" />
          
        </div>
      </div>
      </div>
  )
}
