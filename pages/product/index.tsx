import React, { useEffect, useState, useRef } from "react";
import { NextPage } from "next";
import ProductCard from "../../libs/components/product/ProductCard";
import TrendingProducts from "../../libs/components/homepage/TrendingProducts";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import { useRouter } from "next/router";
import { ProductsInquiry } from "../../libs/types/product/product.input";
import { Product } from "../../libs/types/product/product";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Direction, Message } from "../../libs/enums/common.enum";
import { ProductType } from "../../libs/enums/product.enum";
import { GET_PRODUCTS } from "../../apollo/user/query";
import { LIKE_TARGET_PRODUCT } from "../../apollo/user/mutation";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { T } from "../../libs/types/common";
import {
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "../../libs/sweetAlert";
import { userVar } from "../../apollo/store";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

type ProductListProps = { initialInput?: ProductsInquiry };

const DEFAULT_INPUT: ProductsInquiry = {
  page: 1,
  limit: 8,
  sort: "createdAt",
  direction: Direction.DESC,
  search: {
    pricesRange: { start: 0, end: 2000000 },
  },
};

const ProductList: NextPage<ProductListProps> = ({
  initialInput = DEFAULT_INPUT,
}) => {
  const router = useRouter();
  const user = useReactiveVar(userVar);
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
  const [collectionMenuOpen, setCollectionMenuOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] =
    useState<string>("All Collections");
  const [searchText, setSearchText] = useState<string>("");
  const [priceMenuOpen, setPriceMenuOpen] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] =
    useState<string>("All Prices");
  const [periodMenuOpen, setPeriodMenuOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("All Time");
  const collectionMenuRef = useRef<HTMLDivElement>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const priceMenuRef = useRef<HTMLDivElement>(null);
  const periodMenuRef = useRef<HTMLDivElement>(null);

  /** APOLLO REQUESTS **/
  const { refetch: refetchProducts } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "network-only",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setProducts(data?.getProducts?.list ?? []);
      setTotal(data?.getProducts?.metaCounter?.[0]?.total ?? 0);
    },
  });

  const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

  // Collection options
  const collectionOptions = [
    { id: "all", name: "All Collections", value: null },
    { id: "clothing", name: "Clothing", value: ProductType.CLOTHING },
    {
      id: "home-living",
      name: "Home & Living",
      value: ProductType.HOME_LIVING,
    },
    { id: "accessory", name: "Accessories", value: ProductType.ACCESSORY },
    { id: "handmade", name: "Handmade", value: ProductType.HANDMADE },
    { id: "vintage", name: "Vintage", value: ProductType.VINTAGE },
    {
      id: "craft-supplies",
      name: "Craft Supplies",
      value: ProductType.CRAFT_SUPPLIES,
    },
    { id: "jewelry", name: "Jewelry", value: ProductType.JEWELRY },
    {
      id: "pet-products",
      name: "Pet Products",
      value: ProductType.PET_PRODUCTS,
    },
    {
      id: "art-collectables",
      name: "Art & Collectables",
      value: ProductType.ART_COLLECTABLES,
    },
    { id: "children", name: "Children", value: ProductType.CHILDREN },
  ];

  // Price range options
  const priceRangeOptions = [
    { id: "all", name: "All Prices", value: null },
    { id: "under-50", name: "Under $50", value: { start: 0, end: 50 } },
    { id: "50-100", name: "$50 - $100", value: { start: 50, end: 100 } },
    { id: "100-200", name: "$100 - $200", value: { start: 100, end: 200 } },
    { id: "200-500", name: "$200 - $500", value: { start: 200, end: 500 } },
    { id: "500-1000", name: "$500 - $1,000", value: { start: 500, end: 1000 } },
    {
      id: "over-1000",
      name: "Over $1,000",
      value: { start: 1000, end: 2000000 },
    },
  ];

  // Period range options
  const periodRangeOptions = [
    { id: "all", name: "All Time", value: null },
    {
      id: "today",
      name: "Today",
      value: { start: new Date(), end: new Date() },
    },
    {
      id: "week",
      name: "This Week",
      value: {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
    },
    {
      id: "month",
      name: "This Month",
      value: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
    },
    {
      id: "quarter",
      name: "This Quarter",
      value: {
        start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
    },
    {
      id: "year",
      name: "This Year",
      value: {
        start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
    },
  ];

  /** LIFECYCLES **/
  useEffect(() => {
    if (router.query.input) {
      const inputObj = JSON.parse(router?.query?.input as string);
      setSearchFilter(inputObj);
    }
    setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
  }, [router]);

  // Click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (
        collectionMenuRef.current &&
        !collectionMenuRef.current.contains(event.target as Node)
      ) {
        setCollectionMenuOpen(false);
      }
      if (
        sortMenuRef.current &&
        !sortMenuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
      if (
        priceMenuRef.current &&
        !priceMenuRef.current.contains(event.target as Node)
      ) {
        setPriceMenuOpen(false);
      }
      if (
        periodMenuRef.current &&
        !periodMenuRef.current.contains(event.target as Node)
      ) {
        setPeriodMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /** HANDLERS **/
  const likeProductHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!(user as any)._id) throw new Error(Message.SOMETHING_WENT_WRONG);
      await likeTargetProduct({ variables: { productId: id } });
      await refetchProducts({ input: searchFilter });
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
          sort: "productPrice",
          direction: Direction.ASC,
        });
        setFilterSortName("Lowest Price");
        break;
      case "highest":
        setSearchFilter({
          ...searchFilter,
          sort: "productPrice",
          direction: Direction.DESC,
        });
        setFilterSortName("Highest Price");
        break;
    }
    setMenuOpen(false);
  };

  const collectionHandler = (collection: {
    id: string;
    name: string;
    value: ProductType | null;
  }) => {
    setSelectedCollection(collection.name);

    if (collection.value === null) {
      // Reset to all collections
      setSearchFilter({
        ...searchFilter,
        search: {
          ...searchFilter.search,
          typeList: undefined,
        },
      });
    } else {
      // Filter by specific collection
      setSearchFilter({
        ...searchFilter,
        search: {
          ...searchFilter.search,
          typeList: [collection.value],
        },
      });
    }

    setCollectionMenuOpen(false);
  };

  const searchHandler = () => {
    setSearchFilter({
      ...searchFilter,
      page: 1, // Reset to first page when searching
      search: {
        ...searchFilter.search,
        text: searchText.trim() || undefined,
      },
    });
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      searchHandler();
    }
  };

  const priceRangeHandler = (priceRange: {
    id: string;
    name: string;
    value: { start: number; end: number } | null;
  }) => {
    setSelectedPriceRange(priceRange.name);

    if (priceRange.value === null) {
      // Reset to all prices
      setSearchFilter({
        ...searchFilter,
        search: {
          ...searchFilter.search,
          pricesRange: undefined,
        },
      });
    } else {
      // Filter by specific price range
      setSearchFilter({
        ...searchFilter,
        search: {
          ...searchFilter.search,
          pricesRange: priceRange.value,
        },
      });
    }

    setPriceMenuOpen(false);
  };

  const periodRangeHandler = (periodRange: {
    id: string;
    name: string;
    value: { start: Date; end: Date } | null;
  }) => {
    setSelectedPeriod(periodRange.name);

    if (periodRange.value === null) {
      // Reset to all time
      setSearchFilter({
        ...searchFilter,
        search: {
          ...searchFilter.search,
          periodsRange: undefined,
        },
      });
    } else {
      // Filter by specific period range
      setSearchFilter({
        ...searchFilter,
        search: {
          ...searchFilter.search,
          periodsRange: periodRange.value,
        },
      });
    }

    setPeriodMenuOpen(false);
  };

  const totalPages = Math.max(1, Math.ceil(total / (searchFilter.limit || 8)));

  return (
    <div className="w-full bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-foreground mb-4">
            Explore Products
          </h1>
        </div>

        {/* Filter Bar - Mobile Friendly */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              placeholder="Search products..."
              className="w-full sm:w-80 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
            />
            <button
              onClick={searchHandler}
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded-md bg-pink-500 text-white hover:bg-pink-600 transition-colors"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          {/* Filter Controls - Stacked on mobile */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {/* Collection Filter */}
            <div className="relative" ref={collectionMenuRef}>
              <button
                onClick={() => setCollectionMenuOpen((v) => !v)}
                className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-foreground hover:bg-gray-50 cursor-pointer"
              >
                <span className="hidden sm:inline">Collection:</span>
                <span className="sm:hidden">Collection</span>
                <span className="hidden sm:inline">{selectedCollection}</span>
                <span className="ml-1">▾</span>
              </button>
              {collectionMenuOpen && (
                <div className="absolute left-0 z-20 mt-2 w-48 rounded-md border border-gray-200 bg-white p-1 shadow max-h-60 overflow-y-auto">
                  {collectionOptions.map((collection) => (
                    <button
                      key={collection.id}
                      onClick={() => collectionHandler(collection)}
                      className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      {collection.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range Filter */}
            <div className="relative" ref={priceMenuRef}>
              <button
                onClick={() => setPriceMenuOpen((v) => !v)}
                className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-foreground hover:bg-gray-50 cursor-pointer"
              >
                <span className="hidden sm:inline">Price:</span>
                <span className="sm:hidden">Price</span>
                <span className="hidden sm:inline">{selectedPriceRange}</span>
                <span className="ml-1">▾</span>
              </button>
              {priceMenuOpen && (
                <div className="absolute left-0 z-20 mt-2 w-40 rounded-md border border-gray-200 bg-white p-1 shadow">
                  {priceRangeOptions.map((priceRange) => (
                    <button
                      key={priceRange.id}
                      onClick={() => priceRangeHandler(priceRange)}
                      className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      {priceRange.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Period Range Filter */}
            <div className="relative" ref={periodMenuRef}>
              <button
                onClick={() => setPeriodMenuOpen((v) => !v)}
                className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-foreground hover:bg-gray-50 cursor-pointer"
              >
                <span className="hidden sm:inline">Period:</span>
                <span className="sm:hidden">Period</span>
                <span className="hidden sm:inline">{selectedPeriod}</span>
                <span className="ml-1">▾</span>
              </button>
              {periodMenuOpen && (
                <div className="absolute left-0 z-20 mt-2 w-40 rounded-md border border-gray-200 bg-white p-1 shadow">
                  {periodRangeOptions.map((periodRange) => (
                    <button
                      key={periodRange.id}
                      onClick={() => periodRangeHandler(periodRange)}
                      className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      {periodRange.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort Filter */}
            <div className="relative" ref={sortMenuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-foreground hover:bg-gray-50 cursor-pointer"
              >
                <span className="hidden sm:inline">Sort by:</span>
                <span className="sm:hidden">Sort</span>
                <span className="hidden sm:inline">{filterSortName}</span>
                <span className="ml-1">▾</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 z-20 mt-2 w-40 rounded-md border border-gray-200 bg-white p-1 shadow">
                  <button
                    onClick={() => sortingHandler("new")}
                    className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    New
                  </button>
                  <button
                    onClick={() => sortingHandler("lowest")}
                    className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    Lowest Price
                  </button>
                  <button
                    onClick={() => sortingHandler("highest")}
                    className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    Highest Price
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content - Responsive Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products?.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-white p-10 text-center">
              <img
                src="/img/icons/icoAlert.svg"
                alt="no data"
                className="mb-3 h-10 w-10 opacity-60"
              />
              <p className="text-sm text-gray-600">No products found!</p>
            </div>
          ) : (
            (products ?? []).map((product: Product) => (
              <div
                key={product?._id.toString()}
                className="flex justify-center"
              >
                <ProductCard
                  product={product}
                  likeTargetProductHandler={likeProductHandler}
                />
              </div>
            ))
          )}
        </div>

        {/* Pagination - Mobile Friendly */}
        {products.length !== 0 && (
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-between">
            <div className="text-sm text-muted-foreground text-center sm:text-left">
              Total {total} product{total > 1 ? "s" : ""} available
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => handlePaginationChange(currentPage - 1)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm disabled:opacity-50 hover:bg-gray-50 cursor-pointer"
              >
                Prev
              </button>
              <span className="text-sm px-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => handlePaginationChange(currentPage + 1)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm disabled:opacity-50 hover:bg-gray-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* You May Also Like Section */}
        <div className="mt-12">
          <TrendingProducts title="You May Also Like" />
        </div>
      </div>
    </div>
  );
};

export default withLayoutBasic(ProductList);
