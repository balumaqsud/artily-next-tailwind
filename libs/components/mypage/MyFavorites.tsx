import React, { useState } from "react";
import { NextPage } from "next";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { Pagination, Stack, Typography } from "@mui/material";
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
  const paginationHandler = (e: T, value: number) => {
    setSearchFavorites({ ...searchFavorites, page: value });
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

  return (
    <div id="my-favorites-page" className="w-full">
      <div className="mx-auto w-full max-w-7xl px-4 py-6">
        <div className="mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Favorites</h1>
            <p className="text-muted-foreground">
              We are glad to see you again!
            </p>
          </div>
        </div>
        <div className="mb-6">
          {myFavorites?.length ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {myFavorites?.map((product: Product) => {
                return (
                  <PropertyCard
                    key={product._id.toString()}
                    likeProductHandler={likeProductHandler}
                    product={product}
                    myFavorites={true}
                  />
                );
              })}
            </div>
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-muted-foreground">
              <img
                src="/img/icons/icoAlert.svg"
                alt="no data"
                className="mb-2 h-8 w-8"
              />
              <p>No Favorites found!</p>
            </div>
          )}
        </div>
        {myFavorites?.length ? (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Total {total} favorite product{total > 1 ? "s" : ""}
            </div>
            <div className="flex items-center">
              <Pagination
                count={Math.ceil(total / searchFavorites.limit)}
                page={searchFavorites.page}
                shape="circular"
                color="primary"
                onChange={paginationHandler}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MyFavorites;
