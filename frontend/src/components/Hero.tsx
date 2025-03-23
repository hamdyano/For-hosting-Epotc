//import newhero from "../assets/newhero.jpg";
import DarkHero from "../assets/DarkHero.jpg";


const Hero = () => {
  return (
    <div className="w-full h-auto flex flex-col md:flex-row items-center justify-center">
      <img
        src={DarkHero}
        className="w-full max-h-[800px] md:max-h-[800px] lg:max-h-[800px] object-cover"
        alt="Hero"
      />
    </div>
  );
};

export default Hero;
