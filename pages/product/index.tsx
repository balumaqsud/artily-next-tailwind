import React, { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { NextPage } from "next";
import Link from "next/link";
import ProductCard from "../../libs/components/product/ProductCard";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import { useRouter } from "next/router";
import { PropertiesInquiry as ProductsInquiry } from "../../libs/types/property/property.input";
import { Property as Product } from "../../libs/types/property/property";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Direction, Message } from "../../libs/enums/common.enum";
import { GET_PROPERTIES as GET_PRODUCTS } from "../../apollo/user/query";
import { LIKE_TARGET_PROPERTY as LIKE_TARGET_PRODUCT } from "../../apollo/user/mutation";
import { useMutation, useQuery } from "@apollo/client";
import { T } from "../../libs/types/common";
import {
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "../../libs/sweetAlert";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

type ProductListProps = { initialInput?: ProductsInquiry };

const DEFAULT_INPUT: ProductsInquiry = {
  page: 1,
  limit: 9,
  sort: "createdAt",
  direction: Direction.DESC,
  search: {
    squaresRange: { start: 0, end: 500 },
    pricesRange: { start: 0, end: 2000000 },
  },
};

const ProductList: NextPage<ProductListProps> = ({
  initialInput = DEFAULT_INPUT,
}) => {
  const router = useRouter();
  const [searchFilter, setSearchFilter] = useState<ProductsInquiry>(
    router?.query?.input
      ? JSON.parse(router?.query?.input as string)
      : initialInput
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterSortName, setFilterSortName] = useState("New");

  /** APOLLO REQUESTS **/
  const { refetch: refetchProducts } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "network-only",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setProducts(data?.getProperties?.list);
      setTotal(data?.getProperties?.metaCounter[0].total);
    },
  });

  const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

  /** LIFECYCLES **/
  useEffect(() => {
    if (router.query.input) {
      const inputObj = JSON.parse(router?.query?.input as string);
      setSearchFilter(inputObj);
    }
    setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
  }, [router]);

  /** HANDLERS **/
  const likeProductHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!(user as any)._id) throw new Error(Message.SOMETHING_WENT_WRONG);
      await likeTargetProduct({ variables: { input: id } });
      await refetchProducts({ input: initialInput });
      await sweetTopSmallSuccessAlert("success", 800);
    } catch (error: any) {
      console.log("likeTargetProduct", error);
      sweetMixinErrorAlert(error.message).then();
    }
  };

  const handlePaginationChange = async (value: number) => {
    const next = { ...searchFilter, page: value };
    setSearchFilter(next);
    setCurrentPage(value);
    await router.push(
      `/product?input=${JSON.stringify(next)}`,
      `/product?input=${JSON.stringify(next)}`,
      { scroll: false }
    );
  };

  const sortingHandler = (id: "new" | "lowest" | "highest") => {
    switch (id) {
      case "new":
        setSearchFilter({
          ...searchFilter,
          sort: "createdAt",
          direction: Direction.ASC,
        });
        setFilterSortName("New");
        break;
      case "lowest":
        setSearchFilter({
          ...searchFilter,
          sort: "propertyPrice",
          direction: Direction.ASC,
        });
        setFilterSortName("Lowest Price");
        break;
      case "highest":
        setSearchFilter({
          ...searchFilter,
          sort: "propertyPrice",
          direction: Direction.DESC,
        });
        setFilterSortName("Highest Price");
        break;
    }
    setMenuOpen(false);
  };

  const totalPages = Math.max(1, Math.ceil(total / (searchFilter.limit || 9)));

  return (
    <div id="product-list-page" className="relative w-full">
      <div className="mx-auto w-full max-w-7xl px-4 py-6">
        {/* Header controls */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">
            Explore Products
          </h1>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-foreground hover:bg-gray-50"
            >
              Sort by: {filterSortName}
              <span className="ml-1">▾</span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 z-20 mt-2 w-40 rounded-md border border-gray-200 bg-white p-1 shadow">
                <button
                  onClick={() => sortingHandler("new")}
                  className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100"
                >
                  New
                </button>
                <button
                  onClick={() => sortingHandler("lowest")}
                  className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100"
                >
                  Lowest Price
                </button>
                <button
                  onClick={() => sortingHandler("highest")}
                  className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100"
                >
                  Highest Price
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products?.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-muted-foreground">
              <img
                src="/img/icons/icoAlert.svg"
                alt="no data"
                className="mb-2 h-8 w-8"
              />
              <p>No products found!</p>
            </div>
          ) : (
            products.map((product: Product) => (
              <ProductCard
                key={product?._id}
                product={product}
                likePropertyHandler={likeProductHandler}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {products.length !== 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Total {total} product{total > 1 ? "s" : ""} available
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => handlePaginationChange(currentPage - 1)}
                className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => handlePaginationChange(currentPage + 1)}
                className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default withLayoutBasic(ProductList);
