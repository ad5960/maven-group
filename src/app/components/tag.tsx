"use client"

import { OfferType } from "../models/property"

interface TagProps {
    offerType: OfferType
}

interface BlackTagProps {
    offerType: OfferType,
    onClick: () => void,
    
}

export function Tag({offerType}: TagProps) {
    return (
        <>
            <div className="absolute top-0 left-0 ml-2 mt-2 z-10">
                <div className="w-25 h-8 bg-white opacity-100 rounded-lg justify-center items-center">
                    <p className="text-black text-sm font-bold p-2">{offerType}</p>
                </div>
            </div>
        </>
    )
}

export function BlackTag({offerType, onClick}: BlackTagProps) {
    return (
        <>
            <div className="ml-2 z-10" onClick={onClick}>
                <div className="w-25 h-8 bg-slate-800 opacity-100 rounded-md justify-center items-center">
                    <p className="text-white text-sm font-bold p-2 cursor-pointer">{offerType}</p>
                </div>
            </div>
        </>
    )
}