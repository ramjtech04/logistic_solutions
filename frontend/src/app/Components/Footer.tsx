import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import Image from 'next/image'
import { FaLocationArrow, FaMailBulk, FaPhone } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer  
     className="relative  bg-gray-400 bg-cover bg-center bg-no-repeat "
    >
      {/* Optional dark overlay */}
      <div className="absolute inset-0  bg-white z-10"></div>

    
      <div className='mx-auto my-6 md:my-12 relative z-20 flex max-w-7xl items-center justify-between gap-3 px-4 py-10 max-md:flex-col sm:px-6 sm:py-6 md:gap-6 md:py-8 text-black'>
       
          <div className='flex-col items-center gap-3 max-w-[300px] px-2 hidden md:flex '>
           <Link href="/" className="flex items-center ">

                    <Image src="/img/t_color_logo.png" alt="Logo" width={120} height={120}  className="mx-4 w-full h-full   " />
            
          </Link>
              <p className='text-center '>
At Logistic Solution, we specialize in efficient logistics and transportation services, committed to quality, safety, and customer satisfaction.
</p>

          </div>
      
 <div className=' block w-full md:w-auto md:flex  md:flex-col md:justify-start  gap-5 '>
          <h1 className='text-2xl font-bold mb-4'>Links</h1>
          <Link href='/#about' className='flex justify-start items-center gap-2 font-[600]  text-md'>
     About Us
          </Link>
          <Link href='/#services' className=' flex justify-start items-center gap-2 font-[600] text-md'>
           Services
          </Link>
          <Link href='/#contact' className=' flex justify-start items-center gap-2 font-[600]  text-md'>
          Contact Us
          </Link>
         
        </div>

 <div className='flex  flex-col  gap-5 '>
          <h1 className='text-2xl font-bold mb-4'>Contact Us</h1>
          <Link href='#' className='flex justify-start items-center gap-2 font-[600]  text-md'>
         <FaLocationArrow color='darkred' size={20}  />   H.NO. 10,  SECTOR-9, FARIDABAD-121006, HARYANA
          </Link>
          <Link href='#' className=' flex justify-start items-center gap-2 font-[600] text-md'>
           <FaPhone size={20}  color='blue'/>   +91-9873245859, +91-9310068263
          </Link>
          <Link href='mailto:shreeradheylogistic2025@gmail.com' className=' flex justify-start items-center gap-2 font-[600]  text-md'>
         <FaMailBulk color='green' size={20} /> shreeradheylogistic2025@gmail.com
          </Link>
            <Link href='mailto:srl@shreeradheylogistic.com' className=' flex justify-start items-center gap-2 font-[600]  text-md'>
         <FaMailBulk color='green' size={20} /> srl@shreeradheylogistic.com
          </Link>
         
        </div>
        <div className='flex items-center gap-4'>
          <Link href='#'>
            <FacebookIcon className='size-5' color='blue' />
          </Link>
          <Link href='#'>
            <InstagramIcon className='size-5' color='deeppink' />
          </Link>
          <Link  href='#'>
            <TwitterIcon className='size-5' />
          </Link>
          <Link href='#'>
            <YoutubeIcon className='size-5' color='red' />
          </Link>
        </div>

       
      </div>

      <Separator />

      <div className='mx-auto relative flex z-20 justify-center px-4 py-8 sm:px-6 bg-red-800 text-white'>
        <p className='text-center font-medium text-balance'>
          {`©${new Date().getFullYear()}`}{' '}
          <Link href='https://ramjinfratech.com/' target='_blank' className='hover:underline'>
            Ram J InfraTech
          </Link>
      
        </p>
      </div>
    </footer>
  )
}

export default Footer
