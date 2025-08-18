import React from "react";
import Link from "next/link";
import { Product } from "../../types/product/product";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { REACT_APP_API_URL } from "../../config";

interface ProductCardProps {
  product: Product;
  likeProductHandler?: any;
  // Backward compatibility for existing callers
  likePropertyHandler?: any;
  myFavorites?: boolean;
  recentlyVisited?: boolean;
}

const ProductCard = ({
  product,
  likeProductHandler,
  likePropertyHandler,
  myFavorites,
  recentlyVisited,
}: ProductCardProps) => {
  const user = useReactiveVar(userVar);
  const image = (product as any)?.productImages?.[0]
    ? `${REACT_APP_API_URL}/${(product as any).productImages[0]}`
    : "/img/banner/header1.svg";
  const price = Number((product as any)?.productPrice ?? 0);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-neutral-100 dark:bg-neutral-100">
      <Link
        href={{
          pathname: "/product/detail",
          query: { id: String((product as any)?._id) },
        }}
      >
        <div
          className="relative aspect-[4/3] w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <Link
            href={{
              pathname: "/product/detail",
              query: { id: String((product as any)?._id) },
            }}
            className="min-w-0"
          >
            <h3 className="line-clamp-2 pr-2 text-base font-medium text-foreground">
              {(product as any).productTitle}
            </h3>
          </Link>
          {!recentlyVisited && (
            <button
              onClick={() =>
                (likeProductHandler || likePropertyHandler) &&
                (likeProductHandler || likePropertyHandler)(
                  user,
                  String((product as any)?._id)
                )
              }
              className="ml-2 rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-800"
              aria-label="like"
            >
              {myFavorites ||
              (product?.meLiked && product?.meLiked[0]?.myFavorite) ? (
                <FavoriteIcon fontSize="small" className="text-red-500" />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )}
            </button>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
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
      </div>
    </div>
  );
};

export default ProductCard;
