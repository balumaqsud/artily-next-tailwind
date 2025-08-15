import React from "react";
import { Product } from "../../types/product/product";
import { REACT_APP_API_URL } from "../../config";

interface TrendingProductsCardProps {
  product: Product | any;
}

const TrendingProductsCard = ({ product }: TrendingProductsCardProps) => {
  const price = Number(product?.productPrice ?? product?.productPrice ?? 0);
  const image =
    product?.productImages?.[0] ?? product?.propertyImages?.[0] ?? "";

  return (
    <div className="w-[320px] shrink-0 transition-all duration-1000 ease-in-out hover:scale-105 cursor-pointer">
      <div
        className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-cover bg-center shadow-sm"
        style={{ backgroundImage: `url(${REACT_APP_API_URL}/${image})` }}
      >
        <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-2 text-sm font-semibold text-gray-900 shadow">
          USD {price.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default TrendingProductsCard;
