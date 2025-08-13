import React from "react";
import ProductRangeCard from "./ProductRangeCard";

interface Collection {
  _id: string;
  title: string;
  image: string;
}

const ProductRange = () => {
  const fallbackCollections: Collection[] = [
    { _id: "fallback-1", title: "Shop Apparel", image: "/banner/main.jpg" },
    { _id: "fallback-2", title: "Shop Posters", image: "/banner/main2.jpg" },
    {
      _id: "fallback-3",
      title: "Back to School Essentials",
      image: "/banner/main7.jpg",
    },
  ];

  return (
    <section className="w-full px-4 py-10">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
            See Our Product Range
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {fallbackCollections.map((collection: Collection) => (
            <ProductRangeCard
              key={collection._id}
              href={`/product/${collection._id}`}
              title={collection.title}
              image={collection.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductRange;
