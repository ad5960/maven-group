import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/nav";
import CulverCityNight from "./assets/CulverCityNight.jpg"
export default function Page() {
  return (
    <>
      <Navbar/>
      <div className="w-full h-screen max-h-screen overflow-hidden">
        <Image src={CulverCityNight} alt="Culver City Night" layout="responsive"/>
        <div className="absolute inset-0 flex justify-center items-center">
          <p className="text-white text-center text-2xl"><span className="text-6xl">maven</span><span className="text-2xl"> noun </span><br /><span className="text-3xl"> ma-ven </span><br/> variants or less commonly known as mavin <br/>: One who is experienced or knowledgeable: EXPERT</p>
        </div>  
      </div>
      <div className="w-full h-[500px]"></div>
    </>
  )
}
