import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/nav";
import SantaMonica from "../assets/SantaMonica.jpg"
import PropertyCard from "../components/property_card";
import { BlackTag } from "../components/tag";
import SingleProperty from "./single_property";
export default function Page() {
    return (
        <>
            <Navbar/>
            <div className="w-full h-10 mt-32">
                <span className="w-1/2 justify-center items-center"><p className="text-4xl font-bold text-center">Properties</p></span>
            </div>
            <div className="flex w-full h-20 justify-center items-center px-24 my-10">
                <div className="flex flex-row w-2/3 h-full bg-slate-300  justify-around items-center rounded-lg">
                    <select className="w-1/3 h-1/2 mx-2 border border-slate-400 rounded-lg">
                        <option value="option1">Location</option>
                        <option value="option2">Culver City</option>
                        <option value="option3">Los Angeles</option>
                    </select>
                    <select className="w-1/3 h-1/2 mx-2 border border-slate-400 rounded-lg">
                        <option value="option1">Type</option>
                        <option value="option2">Commercial</option>
                        <option value="option3">Industrial</option>
                    </select>
                    <button className="w-1/3 h-1/2 mx-2 bg-slate-700 text-white rounded-lg">
                        Update
                    </button>
                </div>
            </div>
            <div className="flex w-full h-4 justify-center items-center px-24 my-2">
                <div className="flex flex-row w-2/3 justify-start items-center relative">
                    <p className="text-xl text-center">Select: </p>
                    <BlackTag/>
                    <BlackTag/>
                    <BlackTag/>
                    <BlackTag/>

                </div>
            </div>
            <div className="flex flex-col my-20 justify-center items-center">
                <div className="flex flex-row m-5">
                    <PropertyCard/>
                    <PropertyCard />
                    <PropertyCard />
                </div>
                <div className="flex flex-row m-5">
                    <PropertyCard />
                    <PropertyCard />
                    <PropertyCard />
                </div>
                <div className="flex flex-row m-5">
                    <PropertyCard />
                    <PropertyCard />
                    <PropertyCard />
                </div>
            </div>
        </>
    )
}
