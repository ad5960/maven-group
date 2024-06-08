import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/nav";
import SantaMonica from "../assets/SantaMonica.jpg"
export default function Page() {
    return (
        <>
            <Navbar />
            <div className="relative w-full h-[40vh]"> {/* Set the height to 50% of viewport height */}
                <Image
                    src={SantaMonica}
                    alt="Los Angeles Night"
                    layout="fill"
                    objectFit="cover"
                    className="opacity-90"
                />
                <div className="absolute inset-0 flex justify-center items-center">
                    <p className="text-white text-center text-5xl">Careers</p>
                </div>
            </div>
            <div className="flex flex-col mt-20">
                <p className="text-5xl leading-snug text-center font-bold">Our agents are some of the most <br/> respected in the marketplace.</p>
                <div className="flex justify-center my-4">
                    <p className="w-1/2 text-lg text-center">This gives each of our team members pride. Our management is collaborative with the needs of the individual agents and each, in turn, contributes to a mutual success for the other. We make every effort to acknowledge and reward hard work and dedication, more so than most other companies, large and small.</p>
                </div>
            </div>

            <div className="flex flex-col mt-20 mx-20">
                <div className="flex flex-row">
                    <div className="flex flex-1 flex-col mx-10">
                            <p className="text-4xl font-bold my-5">Location</p>
                            <p>Our office is located in Culver City and serves the immediately surrounding markets of Los Angeles.</p>
                        </div>
                    <div className="flex flex-1 flex-col mx-10">
                        <p className="text-4xl font-bold my-5">What We Seek</p>
                            <p>We seek individuals who stand out from the rest, possess unique personal and professional traits, recognize the degree of commitment required for commission rewarded agent pursuits, and have the stamina to always put the client first in the brokerage representation profession.</p>
                        </div>
                </div>
                <div className="flex flex-row my-10">
                    <div className="flex flex-1 flex-col mx-10">
                        <p className="text-4xl font-bold my-5">Benefits</p>
                        <p>The company’s commission splits are far superior to the major public brokerage houses. Our leadership respects the contributions agents make to the success of the company and never loses sight of the mutuality of that unique relationship.</p>
                    </div>
                    <div className="flex flex-1 flex-col mx-10">
                        <p className="text-4xl font-bold my-5">Apply</p>
                        <p>To apply, please send a cover letter and resume to: chris@mavengroups.com</p>
                    </div>
                </div>
            </div>
        </>
    )
}
