import Image from "next/image";
import Navbar from "../components/nav";
import ContactForm from "../components/contact_form";
import Footer from "../components/footer";

export default function Page() {
  return (
    <>
      <Navbar />
      <div className="relative w-full h-[40vh]">
        <Image
          src="https://d2m41b1lxy01wm.cloudfront.net/SantaMonica.jpg"
          alt="Los Angeles Night"
          layout="fill"
          objectFit="cover"
          className="opacity-90"
        />
        <div className="absolute inset-0 flex justify-center items-center">
          <p className="text-white text-center text-4xl md:text-5xl">Contact Us</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row w-full justify-center mt-10 mb-20 px-4 md:px-10">
        <div className="flex flex-col mx-4 lg:mx-10 mb-10 lg:mb-0 w-full lg:w-1/2">
          <p className="text-2xl md:text-3xl font-bold">General Inquiries</p>
          <div>
            <p className="mt-5 mb-5 flex flex-1 font-bold">
              Email: chris@maviancre.com
            </p>
            <p className="mt-5 mb-2">9350 Wilshire Blvd, Suite 203,</p>
            <p className="mb-5">Beverly Hills, CA 90212</p>
            <p className="mt-5 mb-5">Brokerage ID: 02235958</p>
          </div>

          <div className="mt-5">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.0754929225!2d-118.3980931242828!3d34.06757897315123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bbfe597f503d%3A0x36663419635891c8!2s9350%20Wilshire%20Blvd%20Suite%20203%2C%20Beverly%20Hills%2C%20CA%2090212!5e0!3m2!1sen!2sus!4v1727572689229!5m2!1sen!2sus"
              width="100%"
              height="300"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
        <div className="w-full lg:w-1/2 lg:mx-10">
          <ContactForm />
        </div>
      </div>

      <Footer />
    </>
  );
}
