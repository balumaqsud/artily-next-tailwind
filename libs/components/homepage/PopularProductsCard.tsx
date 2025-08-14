import React from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarRateIcon from "@mui/icons-material/StarRate";
import { Property as Product } from "../../types/property/property";
import { REACT_APP_API_URL } from "../../config";
import { useRouter } from "next/router";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";

interface PopularProductCardProps {
  product: Product | any;
  likeTargetProductHandler: (user: any, id: string) => void;
}

const PopularProductsCard = ({
  product,
  likeTargetProductHandler,
}: PopularProductCardProps) => {
  const router = useRouter();
  const user = useReactiveVar(userVar);

  const openDetail = async (id: string) => {
    await router.push({ pathname: "product/detail", query: { id } });
  };

  const price = Number(product?.productPrice ?? product?.propertyPrice ?? 0);
  const rating = Number(
    product?.productRank ?? product?.propertyRank ?? 4.8
  ).toFixed(1);

  return (
    <div className="w-[360px] rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-neutral-900">
      <div
        role="button"
        onClick={() => openDetail(product._id)}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-cover bg-center"
        style={{
          backgroundImage: `url(${REACT_APP_API_URL}/${
            product?.productImages?.[0] ?? product?.propertyImages?.[0]
          })`,
        }}
      />

      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3
            className="max-w-[80%] truncate text-base font-medium text-foreground"
            onClick={() => openDetail(product._id)}
          >
            {product?.productTitle ?? product?.propertyTitle}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{rating}</span>
            <StarRateIcon fontSize="inherit" className="text-yellow-400" />
            <button
              aria-label="like"
              onClick={(e) => {
                e.stopPropagation();
                likeTargetProductHandler(user, product._id);
              }}
              className="ml-2 text-gray-500 hover:text-red-500"
            >
              {product?.meLiked && product?.meLiked[0]?.myFavorite ? (
                <FavoriteIcon fontSize="small" className="text-red-500" />
              ) : (
                <FavoriteIcon fontSize="small" />
              )}
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="text-xl font-extrabold text-green-700">
            USD {price.toFixed(2)}
          </div>
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
            40% off
          </span>
        </div>
        <div className="mt-1 text-sm text-muted-foreground line-through">
          USD {(price * 1.6).toFixed(2)}
        </div>
        <div className="mt-3 text-sm text-muted-foreground">
          Most loved this week
        </div>
      </div>
    </div>
  );
};

export default PopularProductsCard;
