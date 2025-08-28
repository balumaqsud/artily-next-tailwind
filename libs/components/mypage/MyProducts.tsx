import React, { useState } from "react";
import { NextPage } from "next";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import PropertyCard from "../product/ProductCard";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { Product } from "../../types/product/product";
import { SellerProductsInquiry } from "../../types/product/product.input";
import { T } from "../../types/common";
import { ProductStatus } from "../../enums/product.enum";
import { userVar } from "../../../apollo/store";
import { useRouter } from "next/router";
import {
  UPDATE_PRODUCT,
  LIKE_TARGET_PRODUCT,
} from "../../../apollo/user/mutation";
import { GET_ARTIST_PRODUCTS } from "../../../apollo/user/query";
import {
  sweetConfirmAlert,
  sweetErrorAlert,
  sweetErrorHandling,
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "../../sweetAlert";
import { Message } from "@/libs/enums/common.enum";
import ProductCard from "../product/ProductCard";

const DEFAULT_INPUT: SellerProductsInquiry = {
  page: 1,
  limit: 6,
  sort: "createdAt",
  search: {
    productStatus: ProductStatus.ACTIVE,
  },
};

const MyProducts = ({ initialInput = DEFAULT_INPUT }) => {
  const device = useDeviceDetect();
  const [searchFilter, setSearchFilter] =
    useState<SellerProductsInquiry>(initialInput);
  const [sellerProducts, setSellerProperties] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const user = useReactiveVar(userVar);
  const router = useRouter();

  /** APOLLO REQUESTS **/
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

  const {
    loading: getSellerProductsLoading,
    data: getSellerProductsData,
    error: getSellerProductsError,
    refetch: getSellerProductsRefetch,
  } = useQuery(GET_ARTIST_PRODUCTS, {
    fetchPolicy: "network-only",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      console.log("getSellerProducts data:", data);
      setSellerProperties(data?.getSellerProducts?.list || []);
      setTotal(data?.getSellerProducts?.metaCounter?.[0]?.total ?? 0);
    },
    onError: (error) => {
      console.error("getSellerProducts error:", error);
    },
  });

  /** HANDLERS **/
  const paginationHandler = (page: number) => {
    setSearchFilter({ ...searchFilter, page });
  };

  const changeStatusHandler = (value: ProductStatus) => {
    setSearchFilter({
      ...searchFilter,
      search: { productStatus: value },
      page: 1,
    });
  };

  const deleteProductHandler = async (id: string) => {
    try {
      if (await sweetConfirmAlert("Do you want to delete this product?")) {
        await updateProduct({
          variables: {
            input: {
              _id: id,
              productStatus: "DELETE",
            },
          },
        });
        await getSellerProductsRefetch({ input: searchFilter });
        await sweetErrorAlert("Product deleted successfully!");
      }
    } catch (error) {
      console.error("deleteProductHandler error:", error);
      await sweetErrorHandling(error);
    }
  };

  const updateProductHandler = async (status: string, id: string) => {
    try {
      if (
        await sweetConfirmAlert(`Do you want to change status to ${status}?`)
      ) {
        await updateProduct({
          variables: {
            input: {
              _id: id,
              productStatus: status,
            },
          },
        });
        await getSellerProductsRefetch({ input: searchFilter });
        await sweetErrorAlert(`Product status updated to ${status}!`);
      }
    } catch (error) {
      console.error("updateProductHandler error:", error);
      await sweetErrorHandling(error);
    }
  };

  const likeProductHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!(user as any)._id) throw new Error(Message.SOMETHING_WENT_WRONG);
      await likeTargetProduct({ variables: { productId: id } });
      await getSellerProductsRefetch({ input: searchFilter });
      await sweetTopSmallSuccessAlert("success", 800);
    } catch (error: any) {
      console.log("likeTargetProduct", error);
      sweetMixinErrorAlert(error.message).then();
    }
  };

  if (user?.memberType !== "ARTIST" && user?.memberType !== "SELLER") {
    router.back();
    return null;
  }

  const totalPages = Math.ceil(total / searchFilter.limit);

  return (
    <div id="my-product-page" className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
          My Products
        </h1>
        <p className="text-sm text-gray-500">We are glad to see you again!</p>
      </div>

      {/* Status Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => changeStatusHandler(ProductStatus.ACTIVE)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              searchFilter.search.productStatus === "ACTIVE"
                ? "bg-white text-pink-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            On Sale
          </button>
          <button
            onClick={() => changeStatusHandler(ProductStatus.SOLD)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              searchFilter.search.productStatus === "SOLD"
                ? "bg-white text-pink-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Sold
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sellerProducts?.length ? (
          sellerProducts?.map((product: Product) => (
            <ProductCard
              key={product._id.toString()}
              product={product}
              likeTargetProductHandler={likeProductHandler}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-white p-10 text-center">
            <p className="text-sm text-gray-600">No products found!</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {sellerProducts?.length > 0 && (
        <div className="mt-6 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => paginationHandler(searchFilter.page - 1)}
              disabled={searchFilter.page <= 1}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => paginationHandler(page)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  page === searchFilter.page
                    ? "bg-[#ff6b81] text-white"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => paginationHandler(searchFilter.page + 1)}
              disabled={searchFilter.page >= totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="text-sm text-gray-500">
            Total {total} product{total > 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;
