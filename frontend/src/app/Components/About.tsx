import React from "react";

export default function About() {
  return (
    <section
      id="about"
      className="relative py-12 md:py-20 bg-cover bg-center"
      
    >
      {/* Overlay */}
    

      {/* Content */}
      <div className="relative container mx-auto px-4 grid md:grid-cols-2  gap-12 h-auto md:h-100 ">

        {/* Left Content */}
        <div
        className="hidden md:flex flex-col items-center justify-center gap-6 text-center md:text-left relative z-10 p-2 rounded-[10px] bg-[url('/img/mainbg.jpg')] bg-cover bg-center "
       >
          <div className="absolute inset-0 z-10 bg-black/70  rounded-[10px] hidden md:block"></div>
          <div className="z-20 hidden md:block">

              <h1 className="text-3xl md:text-4xl font-bold text-white z-20">
            About Our Logistics Company
          </h1>

          <p className="mt-4 text-white leading-relaxed z-20">
            We are a growing logistics company, registered in 2025, offering
            road transport and Full Truck Load (FTL) services across selected
            routes in India.
          </p>

          <p className="mt-4 text-white leading-relaxed z-20">
            Our expertise includes industrial cargo movement for leading
            organizations such as Adani, Tata, JSW, and Tata Steel, focusing on
            bulk and heavy material handling.
          </p>
          </div>
        
        </div>

        {/* Right Highlights */}
        <div className="space-y-12 ">
          <div className="p-5 border-l-4 border-red-800 bg-gray-50/90 rounded">
            <h3 className="font-semibold text-gray-800">Reliable Delivery</h3>
            <p className="text-gray-600 mt-2">
              Accurate coordination and on-time execution across routes.
            </p>
          </div>

          <div className="p-5 border-l-4 border-red-800 bg-gray-50/90 rounded">
            <h3 className="font-semibold text-gray-800">Industry Trust</h3>
            <p className="text-gray-600 mt-2">
              Trusted by major industrial and infrastructure companies.
            </p>
          </div>

          <div className="p-5 border-l-4 border-red-800 bg-gray-50/90 rounded">
            <h3 className="font-semibold text-gray-800">Operational Control</h3>
            <p className="text-gray-600 mt-2">
              Strong internal systems to track trips, expenses, and data.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
