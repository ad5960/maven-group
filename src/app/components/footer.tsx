import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full bg-black text-white py-6">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
                <div className="mb-4 md:mb-0 text-center md:text-left">
                    <p>&copy; {new Date().getFullYear()} Maven Group. All rights reserved.</p>
                </div>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                    <Link href="/contact_us" className="hover:underline text-center">Contact Us</Link>
                </div>
            </div>
        </footer>
    );
}
