import React from "react";
import ProductRangeCard from "./ProductRangeCard";
import { ScrollArea, ScrollBar } from "@/libs/components/ui/scroll-area";
import { Button } from "@/libs/components/ui/button";
import { fallbackCollections } from "@/libs/config";

const ProductRange = () => {
  return (
    <section className="w-full px-4 py-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-muted-foreground">
            See Our Product Range
          </h2>
        </div>

        <ScrollArea className="w-full overflow-hidden">
          <div className="flex w-max gap-6 p-4">
            {fallbackCollections.map((collection: any) => (
              <div key={collection._id} className="shrink-0 w-[360px]">
                <ProductRangeCard
                  href={`/product?input=${JSON.stringify({
                    page: 1,
                    limit: 9,
                    sort: "createdAt",
                    direction: "DESC",
                    search: {
                      typeList: [collection._id],
                    },
                  })}`}
                  title={collection.title}
                  image={collection.image}
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

export default ProductRange;
