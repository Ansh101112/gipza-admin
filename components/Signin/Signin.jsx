import React from "react";
import Image from "next/image";
import shape from "../../public/Shape.png";
import dog from "../../public/dog.png";
import SignInForm from "./SignInForm";

const Signin = () => {
  return (
    <div className="flex h-screen max-lg:flex-col">
      <div className="basis-1/2 flex-1  bg-baw-yellow relative flex flex-col items-center h-full">
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 mt-4">
        </div>
        <div className="relative flex flex-col">
          <Image
            src={shape}
            alt="Decorative Shape"
            width={420}
            height={420}
            className="object-cover md:min-w-[25rem] w-[15rem] md:ml-0 ml-28 rounded-3xl md:h-[28rem] h-[18rem] bg-slate-400"
          />
          <Image
            src={dog}
            alt="Dog Image"
            width={400}
            height={200}
            className="object-contain md:w-80 w-40 absolute md:left-10 left-1/2 md:-bottom-[10.4rem] -bottom-[5.2rem]"
          />
        </div>
      </div>
      <div className="md:basis-1/2 flex-1  flex justify-center items-center h-full max-lg:w-full">
        <SignInForm/>
      </div>
    </div>
  );
};

export default Signin;
