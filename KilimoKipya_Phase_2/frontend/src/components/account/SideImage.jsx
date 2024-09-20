import React from "react";
import useProgressiveImg from "../../hooks/image/useProgressiveImg";

const SideImage = ({ type }) => {
  const [src, { blur }] = useProgressiveImg(
    "/images/greet.jpg",
    "/images/greet.jpg"
  );

  return (
    <div className="block relative w-full md:w-1/2 h-48 md:h-full overflow-hidden">
      <div className="absolute inset-0 z-10 bg-black text-gray-200 bg-opacity-40 text-lg  md:text-xl lg:text-2xl font-semibold flex items-center justify-center ">
        <p className="pl-6 pb-8 md:pb-16 pr-12">
        {type === "seller"
            ? "Start Selling With Ease."
            : "Quality Produce at Your Fingertips."}
        </p>
      </div>{" "}
      <div
        className="relative w-full z-0 h-full"
        style={{
          filter: blur ? "none" : "none",
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
    </div>
  );
};

export default SideImage;
