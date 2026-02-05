'use client';

import Image from 'next/image';

const clients = [
  { name: 'Adani', logo: '/img/clients/adani.png' },
  { name: 'Tata', logo: '/img/clients/tata.png' },
  { name: 'JSW', logo: '/img/clients/jsw.png' },
  { name: 'Tata Steel', logo: '/img/clients/tataSteel.png' },

  { name: 'Darcel', logo: '/img/clients/darcl.png' },
];

const ClientsSection = () => {
  return (
    <section className="py-40 px-4   bg-white" id="clients">
      {/* Header */}
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold text-red-800">
          Clients & Partners
        </h2>
        <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
          We work with industrial and infrastructure leaders across sectors.  
          Our client and partner network continues to grow as we expand operations.
        </p>
      </div>

      {/* Logos Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10 items-center">
        {clients.map((client) => (
          <div
            key={client.name}
            className="group flex flex-col items-center justify-center gap-3 transition-all duration-300"
          >
            <div className="relative w-28 h-16 md:w-32 md:h-20">
              <Image
                src={client.logo}
                alt={client.name}
                fill
                className="object-contain"
              />
            </div>
            <span className="text-sm font-bold text-gray-600  group-hover:text-gray-900 transition-colors">
              {client.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ClientsSection;