import React from "react";
import { Button } from "@/libs/components/ui/button";
import { useRouter } from "next/navigation";
import { Vortex } from "@/libs/components/ui/vortex";

export default function MainBanner() {
  const router = useRouter();
  return (
    <div className="mt-19 w-full px-8 py-1">
      <div
        className="relative h-[400px] sm:h-[500px] md:h-[580px] w-full rounded-[15px] bg-cover bg-center transition-all duration-1000 ease-in-out overflow-hidden"
        style={{
          backgroundImage: `url('/banner/artly7.png')`,
        }}
      >
        <Vortex
          backgroundColor="rgba(0,0,0,0)"
          particleCount={550}
          rangeY={180}
          baseHue={330}
          baseSpeed={0.05}
          rangeSpeed={1.25}
          baseRadius={0.8}
          rangeRadius={1.8}
          className="flex h-full w-full flex-col items-center justify-center px-4 text-center"
        >
          <h1 className="text-emerald-100 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-lg shadow-lg">
            Creative Looks{" "}
            <span className="text-emerald-200 drop-shadow-lg">Begin Here</span>
          </h1>
          <p className="mt-4 sm:mt-6 max-w-xs sm:max-w-lg md:max-w-2xl text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold drop-shadow-2xl shadow-black">
            New chapter, same you. Score deals on tees, stickers & more, all
            with fresh art you'll love
          </p>
          <Button
            className="rounded-full bg-white px-6 sm:px-8 py-4 sm:py-6 mt-6 sm:mt-8 text-base sm:text-lg font-semibold text-gray-900 hover:bg-gray-100 cursor-pointer"
            onClick={() => router.push("/product")}
          >
            Shop Now
          </Button>
        </Vortex>
      </div>
    </div>
  );
}
