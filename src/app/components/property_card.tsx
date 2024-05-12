"use client"
import Image from "next/image";
import LANight from "../assets/LANight.jpg"
import { Tag } from "./tag";
import { redirect } from "next/navigation"
import Link from "next/link";
export default function PropertyCard() {
    
    return (
    <>
        <div className="relative w-[350px] h-[250px] rounded-lg bg-slate-500 mx-5 overflow-hidden shadow-lg">
            <div className="relative">
                    <Image src={LANight} alt="LA Night" className="relative inset-0 h-full w-full object-cover rounded-lg transition-transform duration-300 transform hover:scale-105" />
                <Tag/>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1/4 bg-white opacity-100 shadow-xl z-0 rounded-b-lg pl-2 pt-2 text-lg">
                    <Link href="/properties/single_property"><p>Name of property</p></Link>
            </div>
        </div>
    </>)
}