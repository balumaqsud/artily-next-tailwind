import React, { useState } from "react";
import { ScrollArea, ScrollBar } from "@/libs/components/ui/scroll-area";
import TopProductCard from "./TopProdcutsCard";
import { ProductsInquiry } from "../../types/product/product.input";
import { Product } from "../../types/product/product";
import { GET_PRODUCTS } from "../../../apollo/user/query";
import { useMutation, useQuery } from "@apollo/client";
import { T } from "../../types/common";
import { LIKE_TARGET_PRODUCT as LIKE_TARGET_PRODUCT } from "../../../apollo/user/mutation";
import { Message } from "../../enums/common.enum";
import {
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "../../sweetAlert";

interface TopProductsProps {
  initialInput?: ProductsInquiry;
}

const DEFAULT_INPUT: ProductsInquiry = {
  page: 1,
  limit: 8,
  sort: "productLikes",
  direction: "DESC" as any,
  search: {},
};

const TopProducts = ({ initialInput = DEFAULT_INPUT }: TopProductsProps) => {
  const [topProducts, setTopProducts] = useState<Product[]>([]);

  /** APOLLO REQUESTS **/

  const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

  const {
    loading: getProductsLoading,
    data: getProductsData,
    error: getProductsError,
    refetch: getProductsRefetch,
  } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "cache-and-network",
    variables: { input: initialInput },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setTopProducts(data?.getProducts?.list);
    },
  });
  /** HANDLERS **/
  const likeTargetProductHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.SOMETHING_WENT_WRONG);

      //important
      await likeTargetProduct({ variables: { input: id } });

      //refetch
      await getProductsRefetch({ input: initialInput });
      await sweetTopSmallSuccessAlert("success", 800);
    } catch (error: any) {
      console.log("liketargetProduct", error);
      sweetMixinErrorAlert(error.message).then();
    }
  };

  if (topProducts) console.log("topProducts++:", topProducts);
  if (!topProducts) return null;

  const mockProducts = [
    {
      _id: "1",
      productTitle: "Premium T-Shirt",
      productPrice: 29.99,
      productRank: 4.8,
      productImages: ["/banner/main.jpg"],
      meLiked: [{ myFavorite: false }],
    },
    {
      _id: "2",
      productTitle: "Designer Sticker Pack",
      productPrice: 12.5,
      productRank: 4.9,
      productImages: ["/banner/main.jpg"],
      meLiked: [{ myFavorite: true }],
    },
    {
      _id: "3",
      productTitle: "Art Print Canvas",
      productPrice: 45.0,
      productRank: 4.7,
      productImages: ["/banner/main.jpg"],
      meLiked: [{ myFavorite: false }],
    },
    {
      _id: "4",
      productTitle: "Custom Hoodie",
      productPrice: 65.99,
      productRank: 4.6,
      productImages: ["/banner/main.jpg"],
      meLiked: [{ myFavorite: true }],
    },
    {
      _id: "5",
      productTitle: "Vintage Poster",
      productPrice: 18.75,
      productRank: 4.8,
      productImages: ["/banner/main.jpg"],
      meLiked: [{ myFavorite: false }],
    },
  ];

  const displayProducts = topProducts.length > 0 ? topProducts : mockProducts;

  return (
    <section className="w-full px-4 py-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-muted-foreground">
              Featured Products of summer 2025
            </h2>
          </div>
        </div>

        <ScrollArea className="w-full overflow-hidden">
          <div className="flex w-max gap-4 p-4 ">
            {displayProducts.map((product: any) => (
              <div key={product?._id} className="shrink-0 cursor-pointer">
                <TopProductCard
                  product={product}
                  likeTargetProductHandler={likeTargetProductHandler}
                />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
};

export default TopProducts;
