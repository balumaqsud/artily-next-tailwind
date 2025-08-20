import React, { useState } from "react";
import { ScrollArea, ScrollBar } from "@/libs/components/ui/scroll-area";
import PopularProductsCard from "./PopularProductsCard";
import { ProductsInquiry } from "../../types/product/product.input";
import { Product } from "../../types/product/product";
import { GET_PRODUCTS } from "../../../apollo/user/query";
import { LIKE_TARGET_PRODUCT as LIKE_TARGET_PRODUCT } from "../../../apollo/user/mutation";
import { useMutation, useQuery } from "@apollo/client";
import { T } from "../../types/common";
import {
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "../../sweetAlert";
import { Message } from "../../enums/common.enum";

interface PopularProductsProps {
  initialInput?: ProductsInquiry;
}

const DEFAULT_INPUT: ProductsInquiry = {
  page: 1,
  limit: 10,
  sort: "productLikes",
  direction: "DESC" as any,
  search: {},
};

const PopularProducts = ({
  initialInput = DEFAULT_INPUT,
}: PopularProductsProps) => {
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);

  const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

  const { refetch: refetchProducts } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "cache-and-network",
    variables: { input: initialInput },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setPopularProducts(data?.getProducts?.list);
    },
  });

  const likeTargetProductHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!(user as any)._id) throw new Error(Message.SOMETHING_WENT_WRONG);
      await likeTargetProduct({ variables: { productId: id } });
      await refetchProducts({ input: initialInput });
      await sweetTopSmallSuccessAlert("success", 800);
    } catch (error: any) {
      sweetMixinErrorAlert(error.message).then();
    }
  };

  const mock = [
    {
      _id: "p1",
      productTitle: "Best Seller Tee",
      productPrice: 24.99,
      productRank: 4.8,
      productImages: ["/banner/main.jpg"],
      meLiked: [{ myFavorite: false }],
    },
    {
      _id: "p2",
      productTitle: "Trending Stickers",
      productPrice: 8.5,
      productRank: 4.9,
      productImages: ["/banner/main.jpg"],
      meLiked: [{ myFavorite: true }],
    },
    {
      _id: "p3",
      productTitle: "Popular Canvas",
      productPrice: 39.0,
      productRank: 4.7,
      productImages: ["/banner/main.jpg"],
      meLiked: [{ myFavorite: false }],
    },
    {
      _id: "p4",
      productTitle: "Popular Canvas",
      productPrice: 39.0,
      productRank: 4.7,
      productImages: ["/banner/main.jpg"],
      meLiked: [{ myFavorite: false }],
    },
    {
      _id: "p5",
      productTitle: "Popular Canvas",
      productPrice: 39.0,
      productRank: 4.7,
      productImages: ["/banner/main.jpg"],
      meLiked: [{ myFavorite: false }],
    },
    {
      _id: "p6",
      productTitle: "Popular Canvas",
      productPrice: 39.0,
      productRank: 4.7,
      productImages: ["/banner/main.jpg"],
      meLiked: [{ myFavorite: false }],
    },
  ];
  const items = popularProducts.length > 0 ? popularProducts : (mock as any);

  return (
    <section className="w-full px-4 py-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-muted-foreground">
            Bestsellers you’ll see everywhere soon
          </h2>
        </div>

        <ScrollArea className="w-full overflow-hidden">
          <div className="flex w-max gap-3 sm:gap-4 p-2 sm:p-4">
            {items.map((product: any) => (
              <div key={product?._id} className="shrink-0">
                <PopularProductsCard
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

export default PopularProducts;
