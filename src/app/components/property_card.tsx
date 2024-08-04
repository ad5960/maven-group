"use client"
import Image from "next/image";
import { Tag } from "./tag";
import Link from "next/link";
import { OfferType } from "../models/property";
import { MdLocationOn } from 'react-icons/md';
import beach from "../assets/beach.jpg";

interface Address {
    city: string;
    state: string;
    zipCode: string;
    street: string; // Add other address-related fields as needed
}

interface PropertyCardProps {
    name: string,
    imageUrl: string,
    link: string,
    offer: OfferType,
    price: number | string,
    description: string,
    address: Address
}

export default function PropertyCard({ name, imageUrl, link, offer, price, description, address }: PropertyCardProps) {
    return (
        <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px] mb-6'>
            <Link href={link}>
                <div className="relative ">
                    <Image
                        src={imageUrl ? imageUrl : beach}
                        alt="Thumbnail"
                        className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
                        width={330}
                        height={220}
                    />
                    <div className="absolute top-0 left-0 m-2 w-full">
                        <Tag offerType={offer} />
                    </div>
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
                        { description }
                    </p>
                    <p className='text-slate-500 mt-2 font-semibold'>
                        {price}
                    </p>
                </div>
            </Link>
            
        </div>
    );
}
