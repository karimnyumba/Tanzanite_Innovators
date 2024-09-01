import React from "react";
import useProgressiveImg from "../../hooks/image/useProgressiveImg";

function Hero() {
  const [src, { blur }] = useProgressiveImg(
    "/images/home-banner/home-compressed.webp",
    "/images/home-banner/home.webp"
  );

  return (
    <>
      <section
        className={`relative overflow-hidden  lg:flex h-[30vh] sm:h-[30vh] lg:h-screen lg:items-center `}
      >
        <div className="z-10 absolute mx-auto max-w-7xl lg:px-24 px-4 sm:px-6 top-[50%] -translate-y-[50%]">
          <div className=" text-center sm:text-left ">
            <h1 className="text-3xl font-bold md:text-5xl">
              Farmers
              <strong className="font-bold text-green-700">Marketplace</strong>
            </h1>

            <p className="mt-4 max-w-lg sm:text-xl sm:leading-relaxed">
              Connecting Farmers and Consumers - Bringing Fresh Produce to Your
              Doorstep!
            </p>
            <div className="">
          <button className="text-base font-semibold bg-green-800 p-2 px-4 rounded-md text-white hover:bg-green-400">Connect</button>
        </div>
          </div>
        </div>
        <div
          className="relative w-full h-full"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.25)), url(${src})`,
            filter: blur ? "blur(20px)" : "none",
            // backgroundImage: `url(${src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      </section>
    </>
  );
}

export default Hero;
