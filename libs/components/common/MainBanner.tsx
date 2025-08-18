import React from "react";
import { Button } from "@/libs/components/ui/button";

export default function MainBanner() {
  return (
    <div className="mt-19 w-full px-4">
      <div
        className="relative h-[400px] sm:h-[500px] md:h-[580px] w-full rounded-[10px] bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url('/banner/main.jpg')`,
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-white text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-lg">
            Creative Looks{" "}
            <span className="text-cyan-300 drop-shadow-lg">Begin Here</span>
          </h1>
          <p className="mt-4 sm:mt-6 max-w-xs sm:max-w-lg md:max-w-2xl text-white text-sm sm:text-base md:text-lg lg:text-2xl drop-shadow-md">
            New chapter, same you. Score deals on tees, stickers & more, all
            with fresh art you'll love.
          </p>
          <Button className="rounded-full bg-white px-6 sm:px-8 py-4 sm:py-6 mt-6 sm:mt-8 text-base sm:text-lg font-semibold text-gray-900 hover:bg-gray-100 cursor-pointer">
            Shop Now
          </Button>
        </div>
      </div>
    </div>
  );
}
