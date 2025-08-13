import React from "react";
import Link from "next/link";
import { Button } from "@/libs/components/ui/button";

type ProductRangeCardProps = {
  href: string;
  title: string;
  image: string; // public path to background image
  className?: string;
};

const ProductRangeCard = ({
  href,
  title,
  image,
  className,
}: ProductRangeCardProps) => {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl bg-cover bg-center shadow-sm cursor-pointer ${
        className ?? ""
      }`}
      style={{ backgroundImage: `url('${image}')` }}
    >
      <div className="aspect-[4/3] md:aspect-[16/12]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex w-full justify-center">
        <Link href={href} className="pointer-events-auto">
          <Button className="rounded-full bg-white px-6 py-5 text-base font-semibold text-gray-900 hover:bg-gray-100 cursor-pointer">
            {title}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProductRangeCard;
