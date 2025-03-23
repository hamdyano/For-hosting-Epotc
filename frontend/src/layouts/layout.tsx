
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";


type Props = {
  children: React.ReactNode;
  showHero ? : boolean;
  showAboutHero ? :string | boolean;

  
};

const Layout = ({ children , showHero = false }: Props) => {
  return (
    <div className=" bg-[#ffffff] flex flex-col min -h-screen">
      <Header />
      {showHero && <Hero /> }
    


      
      
      <div className="container mx-auto flex-1 py-10"> {children}</div>
      <Footer/>
    </div>
  );
};

export default Layout;

