import React from "react";
import useProgressiveImg from "../../hooks/image/useProgressiveImg";

const SideImage = ({ type }) => {
  const [src, { blur }] = useProgressiveImg(
    type === "seller" ? "/images/new/femalefarmer4.jpg": "/images/new/traderselling-fruit.webp"
    // "/images/new/traderselling-fruit.webp"
  );

  return (
    <div className="block relative w-full md:w-1/2 h-48 md:h-full overflow-hidden">
      <div className="absolute inset-0 z-10 bg-black text-gray-200 bg-opacity-40 text-lg  md:text-xl lg:text-2xl font-semibold flex items-end justify-end">
   
        <p className="pl-6 pb-8 md:pb-16 pr-12 text-base">
        <p className="font-bold text-xl">
        {type === "seller"
            ? "Start Selling With Ease."
            : "Quality Produce at Your Fingertips."}
        </p>
          {type === "seller"
            ? "Sign up or log in to post your produce, monitor sales, and expand your reach to new buyers"
            : "Register or log in to find and buy fresh farm goods, delivered directly from trusted farmers."}
        </p>
      </div>{" "}
      <div
        className="relative w-full z-0 h-full"
        style={{
          // filter: blur ? "blur(20px)" : "none",
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
