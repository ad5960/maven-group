import Image from "next/image"
import LANight from "../assets/LANight.jpg"

export default function AgentCard() {
    return (<>
        <div className="flex flex-row w-full h-[100px]">
            <div className="flex flex-basis-1/4 w-1/4 mx-2 my-2">
                <Image src={LANight} alt="Agent Photo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-1 flex-col mx-2 my-2">
                <p className="font-bold">Christopher Mavian</p>
                <p className="text-sm">chris@mavengroups.com</p>
                <p className="text-sm">+1 (818) 284-3389</p>
                <p className="text-sm">License</p>
            </div>
        </div>
    </>)
}