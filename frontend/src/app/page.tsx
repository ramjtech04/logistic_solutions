import Footer from "./Components/Footer";


import DownloadApp from "./Components/DownloadApp";
import Navbar from "./Components/Navbar";
import HeroBanner from "./Components/hero";
import ServicePage from "./Components/servies";
import About from "./Components/About";
import Contact from "./Components/Contact";
import ClientsSection from "./Components/ClientSection";


export default function Home() {
  return (
    <>
    <Navbar/>
    <HeroBanner />
   <About/>
   <ServicePage/>
   <ClientsSection/>
   <DownloadApp/>
   <Contact/>
   <Footer/>
    </>
  );
}
