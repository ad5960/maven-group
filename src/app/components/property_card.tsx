"use client"
import Image from "next/image";
import { Tag } from "./tag";
import Link from "next/link";
import { OfferType } from "../models/property";
import { MdLocationOn } from 'react-icons/md';

interface Address {
    city: string;
    state: string;
    zipCode: string;
    street: string;
}

interface PropertyCardProps {
    name: string;
    imageUrl: string;
    link: string;
    offer: OfferType;
    price: number | string;
    description: string;
    address: Address;
    escrow?: string; // Optional escrow property
}

const defaultImg = "https://d2m41b1lxy01wm.cloudfront.net/LANight.jpg"


export default function PropertyCard({
    name,
    imageUrl,
    link,
    offer,
    price,
    description,
    address,
    escrow
}: PropertyCardProps) {

    
    return (
        <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px] mb-6'>
            <Link href={link}>
                <div className="relative">
                    <Image
                        src={imageUrl ? imageUrl : defaultImg}
                        alt="Thumbnail"
                        className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
                        width={330}
                        height={220}
                    />
                    {/* Offer Tag on Top Left */}
                    <div className="top-0 left-0 ml-2 mt-2 z-10">
                        <Tag offerType={offer} />
                    </div>
                    {/* Conditionally render "In Escrow" Tag on Top Right */}
                    {escrow && escrow.toLowerCase() === 'yes' && (
                        <div className="absolute top-0 right-0 mr-2 mt-2 z-10">
                            <div className="px-2 py-0.5 bg-white opacity-100 rounded-lg">
                                <p className="text-black text-sm font-bold">In Escrow</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className='p-3 flex flex-col gap-2 w-full'>
                    <p className='truncate text-lg font-semibold text-slate-700'>
                        {name}
                    </p>
                    <div className='flex items-center gap-1'>
                        <MdLocationOn className='h-4 w-4 text-green-700' />
                        <p className='text-sm text-gray-600 truncate w-full'>
                            {address.street + ", " + address.city + ", " + address.state + ", " + address.zipCode}
                        </p>
                    </div>
                    <p className='text-sm text-gray-600 line-clamp-2'>
                        {description}
                    </p>
                    <p className='text-slate-500 mt-2 font-semibold'>
                        {price}
                    </p>
                </div>
            </Link>
        </div>
    );
}
