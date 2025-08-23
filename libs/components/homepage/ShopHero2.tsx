import * as React from "react";
import Link from "next/link";
import { Button } from "@/libs/components/ui/button";
import { CaretRight } from "phosphor-react";
import { Meteors } from "../ui/meteors";
import { useTranslation } from "next-i18next";

type ShopHero2Props = {
  title?: string;
  blurb?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageSrc?: string; // left-side decorative image
};

export default function ShopHero2({
  title,
  blurb,
  ctaLabel,
  ctaHref = `/product?input=${JSON.stringify({
    page: 1,
    limit: 9,
    sort: "createdAt",
    direction: "DESC",
    search: {},
  })}`,
  imageSrc = "/banner/artistic2.jpeg",
}: ShopHero2Props) {
  const { t } = useTranslation("common");

  return (
    <section className="w-full px-6 py-6">
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-2xl bg-[#1B938B] text-white">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
          {/* Decorative image (left) */}
          <div className="relative hidden h-[400px] w-full md:block">
            <img
              src={imageSrc}
              alt="category preview"
              className="h-full w-full rounded-r-2xl object-cover md:rounded-r-none md:rounded-l-2xl"
            />
          </div>

          {/* Text + CTA (right) */}
          <div className="relative p-8 md:p-12 overflow-hidden">
            <Meteors number={15} />
            <h1 className="relative z-10 text-3xl font-extrabold tracking-tight md:text-5xl">
              {title || t("Inspire Your Space")}
            </h1>
            <p className="relative z-10 mt-4 max-w-2xl text-base md:text-lg">
              {blurb ||
                t(
                  "Thoughtfully crafted goods to elevate everyday living — handmade, unique, and responsibly sourced."
                )}
            </p>
            <Link href={ctaHref} className="relative z-10 mt-6 inline-block">
              <Button className="rounded-full bg-white px-6 py-5 text-base font-semibold text-gray-900 hover:bg-gray-100 cursor-pointer">
                {ctaLabel || t("Start Shopping")}
                <CaretRight size={16} weight="bold" className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
