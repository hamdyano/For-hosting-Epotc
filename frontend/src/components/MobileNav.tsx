import { CircleUserRound, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import Flag from "react-world-flags";
import { useTranslation } from "react-i18next";


const MobileNav = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user } = useAuth0();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang); // Change the language based on the flag clicked
  };


  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="text-[#fc9948]" />
      </SheetTrigger>
      <SheetContent className=" bg-white space-y-3">
        <SheetTitle>
          {isAuthenticated ? (
            <span className="flex items-center font-bold gap-2">
              <CircleUserRound className="text-white" />
              {user?.email}
            </span>
          ) : (
            <span className=" text-[#133355] font-bold">
            {t("Welcome to EPOTC.com !")}
            </span>



          )}

<Separator className=" bg-[#133355] my-4" />


<div className="flex flex-row gap-4 justify-center items-center">
  {/* Egyptian Flag */}
  <button
           onClick={() => handleLanguageChange("ar")}
           className="flex items-center gap-2 text-[#0d1346] text-xs md:text-sm lg:text-base hover:text-[#fc9948] font-['Roboto']"
         >
           <span className="text-xs md:text-sm lg:text-base">AR</span>
           <Flag code="EG" className="w-6 h-6" />
         </button>
 
         {/* UK Flag (EN) */}
         <button
           onClick={() => handleLanguageChange("en")}
           className="flex items-center gap-2 text-[#0d1346] text-xs md:text-sm lg:text-base hover:text-[#fc9948] font-['Roboto']"
         >
           <span className="text-xs md:text-sm lg:text-base">EN</span>
           <Flag code="GB" className="w-6 h-6" />
         </button>
 
         {/* French Flag (FR) */}
         <button
           onClick={() => handleLanguageChange("fr")}
           className="flex items-center gap-2 text-[#0d1346] text-xs md:text-sm lg:text-base hover:text-[#fc9948] font-['Roboto']"
         >
           <span className="text-xs md:text-sm lg:text-base">FR</span>
           <Flag code="FR" className="w-6 h-6" />
         </button>
</div>



        </SheetTitle>
    

        <SheetDescription className="flex flex-col gap-4">
         

          <Link
            to="/"
            className=" text-[#133355]  text-left  font-bold md:text-xs lg:text-base hover:text-[#fc9948] py-2 rounded-lg px-3 font-['Roboto']"
          >
  {t('Home')}
          </Link>

          <div className="relative group">
            {/* Dropdown Trigger */}
            <Link
              to="/"
              className="text-[#133355] text-center font-bold md:hidden lg:block md:text-xs lg:text-base hover:text-[#fc9948] py-2 rounded-lg px-3 font-['Roboto']"
            >
     {t('About Us')}
            </Link>

            {/* Dropdown Menu News //////////////////////////////////*/}

            <div className="hidden group-hover:flex flex-col absolute bg-white shadow-lg rounded-lg left-0 top-full mt-1 w-48 z-10">
              <Link
                to="/FactsAndStatistics"
                className="text-[#133355]  font-semibold text-left px-4 py-2 text-sm hover:bg-[#fc9948] hover:text-white"
              >
                →  {t('Facts and Statistics')}
              </Link>
              <div className="h-[1px] bg-gray-200 my-1"></div>

              <Link
                to="/partnership"
                className="text-[#133355] font-semibold text-left px-4 py-2 text-sm hover:bg-[#fc9948] hover:text-white"
              >
                 →   {t('Partnership')}
              </Link>
              <div className="h-[1px] bg-gray-200 my-1"></div>
          

          
            </div>

            
          </div>







      

          <div className="relative group">
            {/* Dropdown Trigger */}
            <Link
              to="/NewsAndEvents"
              className="text-[#133355] text-center font-bold md:hidden lg:block md:text-xs lg:text-base hover:text-[#fc9948] py-2 rounded-lg px-3 font-['Roboto']"
            >
            {t('News & Events')}
            </Link>

          
          
    

          </div>

          <div className="relative group">
            {/* Dropdown Trigger */}
            <Link
              to="/"
              className="text-[#133355] text-center font-bold md:hidden lg:block md:text-xs lg:text-base hover:text-[#fc9948] py-2 rounded-lg px-3 font-['Roboto']"
            >
            {t('Gallery')}
            </Link>

            {/* Dropdown Menu Events //////////////////////////////////*/}

            <div className="hidden group-hover:flex flex-col absolute bg-white shadow-lg rounded-lg left-0 top-full mt-1 w-48 z-10">
              <Link
                to="/Allphotos"
                className="text-[#133355]  font-semibold text-left px-4 py-2 text-sm hover:bg-[#fc9948] hover:text-white"
              >
            → {t('All Photos')}
              </Link>
              <div className="h-[1px] bg-gray-200 my-1"></div>

              <Link
                to="/Videos"
                className="text-[#133355] font-semibold text-left px-4 py-2 text-sm hover:bg-[#fc9948] hover:text-white"
              >
          → {t('Videos')}
              </Link>
           
            </div>
          </div>

      

          <Link
            to="/ContactUs"
            className="text-[#133355]  text-left font-bold md:text-xs lg:text-base hover:text-[#fc9948] py-2 rounded-lg px-3 font-['Roboto']"
          >
             {t('Contact Us')}
          </Link>

     

     

        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;



/*
 
      <form className="bg-white hover:bg-[#fc9948] p-2 rounded-2xl flex items-center lg:ml-24   border border-gray-300 focus-within:border-[#fc9948]">
        <input
          type="text"
          placeholder="Search ..."
          className="bg-transparent focus:outline-none w-full sm:w-32 placeholder-[#103a47]"
        />
        <FaSearch className="text-[#103a47]" />
      </form>
*/




/*  

<div className="hidden group-hover:flex flex-col absolute bg-white shadow-lg rounded-lg left-0 top-full mt-1 w-48 z-10">
<Link
  to="/news"
  className="text-[#133355]  font-semibold text-left px-4 py-2 text-sm hover:bg-[#fc9948] hover:text-white"
>
→ {t('News')}
</Link>
<div className="h-[1px] bg-gray-200 my-1"></div>

<Link
  to="/events"
  className="text-[#133355] font-semibold text-left px-4 py-2 text-sm hover:bg-[#fc9948] hover:text-white"
>
 →   {t('Events')}
</Link>
<div className="h-[1px] bg-gray-200 my-1"></div>

</div>  */