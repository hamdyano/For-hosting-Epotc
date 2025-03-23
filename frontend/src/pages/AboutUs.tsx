import trainingWithFlag from "../assets/trainingWithFlag.jpg";

function AboutUs() {
  return (
    <div>
      <div className="w-full md:w-1/2 flex flex-col justify-center gap-4 p-6 text-center md:text-left">
        <h2 className="text-[#264e7c]   text-4xl tracking-tighter font-['Montserrat']">
          " The United Nations is our one great hope for a peaceful and free
          world "
        </h2>
        <div className="w-24 border-b-2 border-[#cf6439] my-2"></div>
        <p className="text-[#264e7c] text-1xl tracking-tighter font-['Abel']">
          Ralph Bunche
        </p>
      </div>

      <div className="bg-cover bg-center hover:opacity-100 hover:scale-105 transition-all duration-300 ease-in-out flex flex-col md:flex-row items-center">
        {/* Text */}
        <div className="w-full md:w-1/2 flex flex-col justify-center gap-4 p-6 text-center md:text-left">
          <h2 className="text-[#264e7c] font-bold text-4xl tracking-tighter font-['Roboto']">
            We are The Egyptian Peacekeeping Operations Training Center (EPOTC)
          </h2>
          <div className="w-24 border-b-2 border-[#cf6439]"></div>
          <p className="text-[#264e7c] text-1xl tracking-tighter font-['Roboto']">
            Egypt is keen on enhancing a sustained approach to maintain global
            peace and security, promoting peace and addressing the scourge of
            wars, armed conflicts, violence and terrorism. The Ministry of
            Interior established the Egyptian Peacekeeping Operations Training
            Center (EPOTC) in Police Academy to qualify Police personnel for
            effective contribution in peacekeeping and peacebuilding in conflict
            zones as an approach towards the global humanitarian role of
            peacekeepers.
          </p>
        </div>

        {/* Image */}
        <div className="w-full md:w-3/5">
          <img
            src={trainingWithFlag}
            alt="Description"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
