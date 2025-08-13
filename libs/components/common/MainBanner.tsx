import React from "react";
import { Button } from "@/libs/components/ui/button";

export default function MainBanner() {
  return (
    <div className="mt-18 w-full px-4">
      <div
        className="relative h-[460px] w-full rounded-[10px] bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url('/banner/main${
            Math.floor(Date.now() / 4000) % 2 === 0 ? "" : "7"
          }.jpg')`,
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg">
            Creative Looks{" "}
            <span className="text-cyan-300 drop-shadow-lg">Begin Here</span>
          </h1>
          <p className="mt-6 max-w-2xl text-white text-lg md:text-2xl drop-shadow-md">
            New chapter, same you. Score deals on tees, stickers & more, all
            with fresh art you'll love.
          </p>
          <Button className="mt-8 h-14 w-48 text-lg font-normal rounded-[10px] bg-white text-gray-900 hover:bg-gray-100 cursor-pointer">
            Shop Now
          </Button>
        </div>
      </div>
    </div>
  );
}
