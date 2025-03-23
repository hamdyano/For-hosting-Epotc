import HcategVideo from "../assets/HcategVideo.mp4"


const HeroVideo = () => {
  return (
    <div >
        <video
          src={HcategVideo}
          className=" w-full max-h-[600px] object-cover"
          autoPlay
          loop
          muted
          playsInline
        preload="auto"

     
        
        />
    </div>
  );
};

export default HeroVideo 





//className="  w-full max-h-[600px]  sm:max-h-[400px] md:max-h-[500px]   object-cover  object-cover"





/*const HeroVideo = () => {
  return (
    <div className="video-wrapper">
      <iframe
        src="https://www.youtube.com/embed/7hOUqjTCV90?autoplay=1&loop=1&mute=1&playlist=7hOUqjTCV90"
        className="video-frame"
        title="YouTube video player"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default HeroVideo;*/

