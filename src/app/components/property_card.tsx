import Image from "next/image";
import LANight from "../assets/LANight.jpg"
export default function PropertyCard() {
    return (
    <>
        {/* <div className="w-[350px] h-[250px] rounded-lg bg-slate-500 mx-5">
            <Image src={LANight} alt="LA Night" className="relative inset-0 h-full w-full object-cover rounded-lg" />
            <div className="relative bottom-1/4 left-0 w-full h-1/4 bg-white shadow-xl z-100 rounded-b-lg">
            </div>
            <div className="relative top-0 left-0 ml-2 mt-2 z-10">
                <div className="w-20 h-8 bg-white rounded-lg">
                    <p className="text-black text-sm font-bold p-2">For Lease</p>
                </div>
            </div>
        </div> */}
        <div className="relative w-[350px] h-[250px] rounded-lg bg-slate-500 mx-5">
            <div className="relative">
                <Image src={LANight} alt="LA Night" className="relative inset-0 h-full w-full object-cover rounded-lg" />
                <div className="absolute top-0 left-0 ml-2 mt-2 z-10">
                    <div className="w-25 h-8 bg-white opacity-100 rounded-lg justify-center items-center">
                        <p className="text-black text-sm font-bold p-2">For Lease</p>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1/4 bg-white opacity-100 shadow-xl z-0 rounded-b-lg pl-2 pt-2 text-lg">
                <p>Name of property</p>
            </div>
        </div>
    </>)
}