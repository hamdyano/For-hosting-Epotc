import { Link } from "react-router-dom";
import { FaYoutube } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa6";
import { RiTwitterXLine } from "react-icons/ri";
import { useTranslation } from "react-i18next";


const Footer = () => {

  const { t } = useTranslation();
  
  
  return (
    <footer className=" bg-[#133355] text-ExtraDarkColor rounded-t-3xl mt-8 md:mt-0">
      <div className=" text-white flex flex-col md:flex-row justify-between p-8 md:px-32 px-5">


      






      <div>
  <h2 className="ml-14 font-semibold text-xl pb-4 text-white">
    {t('Follow Us')}
  </h2>
  <div className="flex gap-5 ml-12">
    {/* Facebook */}
    <a
      href="https://www.facebook.com/MoiEgy"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FaFacebook
        size={32}
        className="hover:scale-110 cursor-pointer transition duration-300 ease-in-out"
      />
    </a>

    {/* Twitter */}
    <a
      href="https://x.com/moiegy"
      target="_blank"
      rel="noopener noreferrer"
    >
      <RiTwitterXLine
        size={32}
        className="hover:scale-110 cursor-pointer transition duration-300 ease-in-out"
      />
    </a>

    {/* YouTube */}
    <a
      href="https://www.youtube.com/moiegy"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FaYoutube
        size={32}
        className="hover:scale-110 cursor-pointer transition duration-300 ease-in-out"
      />
    </a>
  </div>
</div>









        <div>
          <h1 className=" font-medium text-xl pb-4 pt-5 md:pt-0">
          {t('EPOTC')}
          </h1>
          <nav className=" flex flex-col gap-2">
            <Link
              to="/"
              className=" hover:scale-105 cursor-pointer transition duration-300 ease-in-out"
            >
            {t('About Us')}
            </Link>
            <Link
              to="/"
              className=" hover:scale-105 cursor-pointer transition duration-300 ease-in-out"
            >
       {t('News & Events')}
            </Link>
            <Link
              to="/"
              className=" hover:scale-105 cursor-pointer transition duration-300 ease-in-out"
            >
            {t('Support')}
            </Link>
          </nav>
        </div>


        <div className=" w-full md:w-1/4">

      
          <h1 className=" font-medium text-xl pb-4 pt-5 md:pt-0">  {t('Contact Us')}</h1>
          <nav className=" flex flex-col gap-2">
            <Link to="/">E-mail : epotc@moi.gov.eg</Link>

            <Link to="/">Phone : +2023840151 +2023840152</Link>
          </nav>
        </div>


        
      </div>



      <div>

        
        <p className=" text-white text-center py-4">
        {t('@ Copy Rights Ministry of internals 2025 | All rights reserved')}


         
        </p>
      </div>
    </footer>
  );
};

export default Footer;








/*  <div className=" w-full md:w-1/4">
          <h1 className=" font-medium text-xl pb-4 pt-5 md:pt-0">Contact Us</h1>
          <nav className=" flex flex-col gap-2">
            <Link to="/">
              123 Elm Street, Suite 456 Springfield, IL 62701 United States
            </Link>
          
            <Link to="/" >
              +123-456-7890
            </Link>
          </nav>
        </div>   */
