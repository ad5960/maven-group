"use client"

export function Tag() {
    return (
        <>
            <div className="absolute top-0 left-0 ml-2 mt-2 z-10">
                <div className="w-25 h-8 bg-white opacity-100 rounded-lg justify-center items-center">
                    <p className="text-black text-sm font-bold p-2">For Lease</p>
                </div>
            </div>
        </>
    )
}

export function BlackTag() {
    return (
        <>
            <div className="ml-2 z-10">
                <div className="w-25 h-8 bg-slate-800 opacity-100 rounded-md justify-center items-center">
                    <p className="text-white text-sm font-bold p-2">For Lease</p>
                </div>
            </div>
        </>
    )
}