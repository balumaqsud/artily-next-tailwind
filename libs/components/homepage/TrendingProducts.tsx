import React, { useState } from "react";
import { ScrollArea, ScrollBar } from "@/libs/components/ui/scroll-area";
import TrendingProductsCard from "./TrendingProductsCard";
import { AllProductsInquiry as ProductsInquiry } from "../../types/product/product.input";
import { Product } from "../../types/product/product";
import { GET_PRODUCTS } from "../../../apollo/user/query";
import { useQuery } from "@apollo/client";
import { T } from "../../types/common";
import { useTranslation } from "next-i18next";

interface TrendingProductsProps {
  initialInput?: ProductsInquiry;
  title?: string;
}

const DEFAULT_INPUT: ProductsInquiry = {
  page: 1,
  limit: 10,
  sort: "productViews" as any,
  direction: "DESC" as any,
  search: {},
};

const TrendingProducts = ({
  initialInput = DEFAULT_INPUT,
  title,
}: TrendingProductsProps) => {
  const { t } = useTranslation("common");
  const [products, setProducts] = useState<Product[]>([]);
  const { refetch: refetchProducts } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "cache-and-network",
    variables: { input: initialInput },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setProducts(data?.getProducts?.list);
    },
  });

  const mock = [
    {
      _id: "t1",
      productTitle: "Pan",
      productPrice: 16.99,
      productImages: ["/banner/main.jpg"],
    },
    {
      _id: "t2",
      productTitle: "Board",
      productPrice: 73.31,
      productImages: ["/banner/main.jpg"],
    },
    {
      _id: "t3",
      productTitle: "Avatar Pack",
      productPrice: 0.31,
      productImages: ["/banner/main.jpg"],
    },
    {
      _id: "t4",
      productTitle: "Avatar Pack B",
      productPrice: 0.33,
      productImages: ["/banner/main.jpg"],
    },
    {
      _id: "t5",
      productTitle: "Mug",
      productPrice: 18.4,
      productImages: ["/banner/main.jpg"],
    },
  ];
  const display = products.length > 0 ? products : (mock as any);

  return (
    <section className="w-full px-4 sm:px-4 py-4 sm:py-8 ">
      <div className="mx-auto w-full max-w-7xl ">
        <h2 className="mb-6 text-xl md:text-2xl font-bold tracking-tight text-muted-foreground">
          {title || t("Explore Recent Trends")}
        </h2>
        <ScrollArea className="w-full overflow-hidden">
          <div className="flex w-max gap-3 sm:gap-4 p-2 sm:p-2">
            {display.map((p: any) => (
              <TrendingProductsCard key={p?._id} product={p} />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
};

export default TrendingProducts;
