import Flag from "react-world-flags";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UsernameMenu from "./UsernameMenu";
import { useAppContext } from "@/contexts2/AppContext";

const MainNav = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  // Use margin classes based on the language direction
  const marginClass = isRTL ? "ml-12" : "mr-12";
  // For dropdown alignment: left for LTR, right for RTL
  const dropdownAlignClass = isRTL ? "right-0" : "left-0";
  // Text alignment in dropdown items
  const textAlignClass = isRTL ? "text-right" : "text-left";

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const { isLoggedIn } = useAppContext();

  return (
    <span
      className={`flex items-center space-x-4 ${
        isRTL ? "flex-row-reverse space-x-reverse" : ""
      }`}
    >
      {/* Navigation Links */}
      <Link
        to="/"
        className={`text-[#ffffff] text-center font-bold md:text-xs lg:text-base hover:text-[#fc9948] py-2 rounded-lg px-3 font-['Roboto'] ${marginClass}`}
      >
        {t("Home")}
      </Link>





      <div className="relative group">
  {/* Dropdown Trigger for About Us */}
  <Link
    to="/aboutus"
    className={`text-[#ffffff] text-center font-bold md:hidden lg:block md:text-xs lg:text-base hover:text-[#fc9948] py-2 rounded-lg px-3 font-['Roboto'] ${marginClass}`}
  >
    {t("About Us")}
  </Link>

  {/* Dropdown Menu for About Us */}
  <div
    className={`hidden group-hover:flex hover:flex delay-150 flex-col absolute bg-white shadow-lg rounded-lg ${dropdownAlignClass} top-full -mt-1 w-48 z-10 transition-all duration-300`}
  >
    <Link
      to="/FactsAndStatistics"
      className={`text-[#133355] font-semibold ${textAlignClass} px-4 py-2 text-sm hover:bg-[#fc9948] hover:text-white`}
    >
      → {t("Facts and Statistics")}
    </Link>
    <div className="h-[1px] bg-gray-200 my-1"></div>
    <Link
      to="/partnership"
      className={`text-[#133355] font-semibold ${textAlignClass} px-4 py-2 text-sm hover:bg-[#fc9948] hover:text-white`}
    >
      → {t("Partnership")}
    </Link>
  </div>
</div>




      <div className="relative group">
        {/* Dropdown Trigger for News & Events (without dropdown content) */}
        <Link
          to="/NewsAndEvents"
          className={`text-[#ffffff] text-center font-bold md:hidden lg:block md:text-xs lg:text-base hover:text-[#fc9948] py-2 rounded-lg px-3 font-['Roboto'] ${marginClass}`}
        >
          {t("News & Events")}
        </Link>
      </div>





      <div className="relative group">
  {/* Dropdown Trigger for Gallery */}
  <Link
    to="/"
    className={`text-[#ffffff] text-center font-bold md:hidden lg:block md:text-xs lg:text-base hover:text-[#fc9948] py-2 rounded-lg px-3 font-['Roboto'] ${marginClass}`}
  >
    {t("Gallery")}
  </Link>

  {/* Dropdown Menu for Gallery */}
  <div
    className={`hidden group-hover:flex hover:flex delay-150 flex-col absolute bg-white shadow-lg rounded-lg ${dropdownAlignClass} top-full -mt-1 w-48 z-10 transition-all duration-300`}
  >
    <Link
      to="/Allphotos"
      className={`text-[#133355] font-semibold ${textAlignClass} px-4 py-2 text-sm hover:bg-[#fc9948] hover:text-white`}
    >
      → {t("All Photos")}
    </Link>
    <div className="h-[1px] bg-gray-200 my-1"></div>
    <Link
      to="/Videos"
      className={`text-[#133355] font-semibold ${textAlignClass} px-4 py-2 text-sm hover:bg-[#fc9948] hover:text-white`}
    >
      → {t("Videos")}
    </Link>
  </div>
</div>




      <div>
        <Link
          to="/ContactUs"
          className={`text-[#ffffff] text-center font-bold md:text-xs lg:text-base hover:text-[#fc9948] py-2 rounded-lg px-3 font-['Roboto'] ${marginClass}`}
        >
          {t("Contact Us")}
        </Link>
      </div>

      <span className="flex space-x-2">
        {isLoggedIn ? (
          <>
        
            <UsernameMenu />
          </>
        ) : (
          <Link
            to="/signin"
            className="flex bg-white items-center text-blue-600 px-3 font-bold hover:bg-gray-100"
          >
      
          </Link>
        )}
      </span>

      <div className={`flex flex-col gap-2 ${isRTL ? "mr-12" : "ml-12"}`}>
        {/* Arabic */}
        <button
          onClick={() => handleLanguageChange("ar")}
          className="flex items-center gap-2 text-[#ffffff] text-xs md:text-sm lg:text-base hover:text-[#fc9948] font-['Roboto']"
        >
          <span className="text-xs md:text-sm lg:text-base">AR</span>
          <Flag code="EG" className="w-6 h-6" />
        </button>

        {/* English */}
        <button
          onClick={() => handleLanguageChange("en")}
          className="flex items-center gap-2 text-[#ffffff] text-xs md:text-sm lg:text-base hover:text-[#fc9948] font-['Roboto']"
        >
          <span className="text-xs md:text-sm lg:text-base">EN</span>
          <Flag code="GB" className="w-6 h-6" />
        </button>

        {/* French */}
        <button
          onClick={() => handleLanguageChange("fr")}
          className="flex items-center gap-2 text-[#ffffff] text-xs md:text-sm lg:text-base hover:text-[#fc9948] font-['Roboto']"
        >
          <span className="text-xs md:text-sm lg:text-base">FR</span>
          <Flag code="FR" className="w-6 h-6" />
        </button>
      </div>
    </span>
  );
};

export default MainNav;






/*  <Link
              className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
              to="/AddingHome"
            >
              {t("Adding Home Page")}
            </Link>
           <Link
              className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
              to="/AddingVideos"
            >
              {t("Adding Videos")}
            </Link>

            <Link
              className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
              to="/AddingPhotos"
            >
              {t("Adding Photos")}
            </Link>
            <Link
              className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
              to="/AddingPartner"
            >
              {t("Adding Partner")}
            </Link>

            <Link
              className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
              to="/MyNews"
            >
              {t("Adding News")}
            </Link>

*/
