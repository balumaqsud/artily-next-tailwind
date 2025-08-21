import React, { useState } from "react";
import { NextPage } from "next";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import PropertyCard from "../product/ProductCard";
import { Product } from "../../types/product/product";
import { T } from "../../types/common";
import { LIKE_TARGET_PRODUCT } from "../../../apollo/user/mutation";
import { useMutation, useQuery } from "@apollo/client";
import { GET_FAVORITES } from "../../../apollo/user/query";
import { Message } from "../../enums/common.enum";
import {
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "../../sweetAlert";

const MyFavorites: NextPage = () => {
  const device = useDeviceDetect();
  const [myFavorites, setMyFavorites] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [searchFavorites, setSearchFavorites] = useState<T>({
    page: 1,
    limit: 6,
  });

  /** APOLLO REQUESTS **/
  const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

  const {
    loading: getFavoritesLoading,
    data: getFavoritesData,
    error: getFavoritesError,
    refetch: getFavoritesRefetch,
  } = useQuery(GET_FAVORITES, {
    fetchPolicy: "network-only",
    variables: { input: searchFavorites },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setMyFavorites(data?.getFavorites?.list);
      setTotal(data?.getFavorites?.metaCounter[0].total ?? 0);
    },
  });

  /** HANDLERS **/
  const paginationHandler = (page: number) => {
    setSearchFavorites({ ...searchFavorites, page });
  };

  const likeProductHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.SOMETHING_WENT_WRONG);

      //important
      await likeTargetProduct({ variables: { input: id } });

      //refetch
      await getFavoritesRefetch({ input: searchFavorites });

      await sweetTopSmallSuccessAlert("success", 800);
    } catch (error: any) {
      console.log("liketargetProduct", error);
      sweetMixinErrorAlert(error.message).then();
    }
  };

  const totalPages = Math.ceil(total / searchFavorites.limit);

  return (
    <div id="my-favorites-page" className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
          My Favorites
        </h1>
        <p className="text-sm text-gray-500">We are glad to see you again!</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {myFavorites?.length ? (
          myFavorites?.map((product: Product) => (
            <PropertyCard
              key={product._id.toString()}
              likeProductHandler={likeProductHandler}
              product={product}
              myFavorites={true}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-white p-10 text-center">
            <img
              src="/img/icons/icoAlert.svg"
              alt=""
              className="mb-3 h-10 w-10 opacity-60"
            />
            <p className="text-sm text-gray-600">No Favorites found!</p>
          </div>
        )}
      </div>

      {myFavorites?.length > 0 && (
        <div className="mt-6 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => paginationHandler(searchFavorites.page - 1)}
              disabled={searchFavorites.page <= 1}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => paginationHandler(page)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  page === searchFavorites.page
                    ? "bg-[#ff6b81] text-white"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => paginationHandler(searchFavorites.page + 1)}
              disabled={searchFavorites.page >= totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="text-sm text-gray-500">
            Total {total} favorite product{total > 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyFavorites;
