import * as React from "react";
import Link from "next/link";
import { Button } from "@/libs/components/ui/button";
import { CaretRight } from "phosphor-react";
import { Meteors } from "../ui/meteors";

type ShopHeroProps = {
  title?: string;
  blurb?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageSrc?: string; // right-side decorative image
};

export default function ShopHero({
  title = "Artisan Creations",
  blurb = "Discover unique handcrafted treasures from talented artists worldwide — where quality meets creativity.",
  ctaLabel = "Browse Collection",
  ctaHref = "/product",
  imageSrc = "/banner/artistic.jpeg",
}: ShopHeroProps) {
  return (
    <section className="w-full px-6 py-6">
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-2xl bg-[#ff6b81] text-white">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
          <div className="relative p-8 md:p-12 overflow-hidden">
            <Meteors number={15} />
            <h1 className="relative z-10 text-3xl font-extrabold tracking-tight md:text-5xl">
              {title}
            </h1>
            <p className="relative z-10 mt-4 max-w-2xl text-base md:text-lg">
              {blurb}
            </p>
            <Link href={ctaHref} className="relative z-10 mt-6 inline-block">
              <Button className="rounded-full bg-white px-6 py-5 text-base font-semibold text-gray-900 hover:bg-gray-100 cursor-pointer">
                {ctaLabel}
                <CaretRight size={16} weight="bold" className="ml-1" />
              </Button>
            </Link>
          </div>

          {/* Decorative image */}
          <div className="relative hidden h-[400px] w-full md:block">
            <img
              src={imageSrc}
              alt="category preview"
              className="h-full w-full rounded-l-2xl object-cover md:rounded-l-none md:rounded-r-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
