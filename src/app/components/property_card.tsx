"use client"
import Image from "next/image";
import { Tag } from "./tag";
import Link from "next/link";
import LANight from "../assets/LANight.jpg"
import { OfferType } from "../models/property";

interface PropertyCardProps {
    name: string,
    imageUrl: string,
    link: string,
    offer: OfferType
}

export default function PropertyCard({name, imageUrl, link, offer}: PropertyCardProps) {
    
    return (
    <>
        <Link href={link}>
            <div className="relative w-[350px] h-[250px] rounded-lg bg-slate-500 mx-5 overflow-hidden shadow-lg">
                <div className="relative">
                        <Image src={imageUrl ? imageUrl : LANight} alt="LA Night" className="relative inset-0 h-full w-full object-cover rounded-lg transition-transform duration-300 transform hover:scale-105" />
                    <Tag offerType={offer}/>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1/4 bg-white opacity-100 shadow-xl z-0 rounded-b-lg pl-2 pt-2 text-lg">
                        <p>{name}</p>
                </div>
            </div>
        </Link>
    </>)
}