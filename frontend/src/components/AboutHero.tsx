import WhatIsEpotc from "../assets/WhatIsEpotc.jpg"

function AboutHero() {
  return (
    <div className="w-full h-auto flex flex-col md:flex-row items-center justify-center  ">
    <img
      src={WhatIsEpotc}
      className="w-full max-h-[800px] md:max-h-[800px] lg:max-h-[800px] object-cover"
      alt="Hero"
    />
  </div>
  )
}

export default AboutHero

/*  lg:max-h-[1200px]*/