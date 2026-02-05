import Image from "next/image";
export default function DownloadApp() {
  return (
    <section className="relative w-full  text-white overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/70 z-1" />

      {/* Background Image */}
      <Image
        src="/img/appbg.jpg" // put image in public folder
        alt="Logistics Background"
        fill
        className="object-cover"
        priority
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
        
        {/* Left Content */}
        <div>
        

          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
            Download Logistic Solution App Free!
          </h1>

          <h2 className="text-white text-2xl md:text-4xl font-bold mb-6">
            Get Exciting Offers!
          </h2>

          <p className="text-gray-300 max-w-xl mb-8">
            Download the Logistic Solution App free and manage deliveries, orders, tracking, and logistics operations easily with a fast, secure, and user-friendly platform built for modern businesses.

          </p>
         

          {/* App Buttons */}
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-3 border border-white rounded-full px-6 py-3 hover:bg-white hover:text-black transition">
              <span className="text-xl">▶</span>
              <div className="text-left">
                <p className="text-xs">Available on</p>
                <p className="font-semibold">Google Play</p>
              </div>
            </button>

            <button className="flex items-center gap-3 border border-white rounded-full px-6 py-3 hover:bg-white hover:text-black transition">
              <span className="text-xl"></span>
              <div className="text-left">
                <p className="text-xs">Available on</p>
                <p className="font-semibold">App Store</p>
              </div>
            </button>
          </div>
        </div>

        {/* Right Mobile Image */}
        <div className="relative flex justify-center lg:justify-center">
          <Image
            src="/img/mobile1.png" // phone mockup image
            alt="Mobile App"
            width={600}
            height={600}
            className="drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
