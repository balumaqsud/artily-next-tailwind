import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import withAdminLayout from "../../../libs/components/layout/LayoutAdmin";
import ProductPanelList from "../../../libs/components/admin/products/ProductList";
import { AllProductsInquiry } from "../../../libs/types/product/product.input";
import { Product } from "../../../libs/types/product/product";
import { ProductType, ProductStatus } from "../../../libs/enums/product.enum";
import {
  sweetConfirmAlert,
  sweetErrorHandling,
} from "../../../libs/sweetAlert";
import { ProductUpdate } from "../../../libs/types/product/product.update";
import {
  REMOVE_PRODUCT_BY_ADMIN,
  UPDATE_PRODUCT_BY_ADMIN,
} from "../../../apollo/admin/mutation";
import { GET_ALL_PRODUCTS_BY_ADMIN } from "../../../apollo/admin/query";
import { T } from "../../../libs/types/common";
import { useMutation, useQuery } from "@apollo/client";
import { Direction } from "../../../libs/enums/common.enum";

const DEFAULT_INPUT: AllProductsInquiry = {
  page: 1,
  limit: 10,
  sort: "createdAt",
  direction: Direction.DESC,
  search: {},
};

const AdminProducts: NextPage = () => {
  const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
  const [productsInquiry, setProductsInquiry] =
    useState<AllProductsInquiry>(DEFAULT_INPUT);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsTotal, setProductsTotal] = useState<number>(0);
  const [value, setValue] = useState(
    productsInquiry?.search?.productStatus
      ? productsInquiry?.search?.productStatus
      : "ALL"
  );
  const [searchType, setSearchType] = useState("ALL");

  /** APOLLO REQUESTS **/
  const [updateProductByAdmin] = useMutation(UPDATE_PRODUCT_BY_ADMIN);
  const [removeProductByAdmin] = useMutation(REMOVE_PRODUCT_BY_ADMIN);

  const {
    loading: getAllProductsByAdminLoading,
    data: getAllProductsByAdminData,
    error: getAllProductsByAdminError,
    refetch: getAllProductsByAdminRefetch,
  } = useQuery(GET_ALL_PRODUCTS_BY_ADMIN, {
    fetchPolicy: "network-only",
    variables: { input: productsInquiry },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setProducts(data?.getAllProductsByAdmin?.list);
      setProductsTotal(data?.getAllProductsByAdmin.metaCounter[0].total ?? 0);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    getAllProductsByAdminRefetch({ input: productsInquiry }).then();
  }, [productsInquiry]);

  /** HANDLERS **/
  const changePageHandler = async (event: unknown, newPage: number) => {
    productsInquiry.page = newPage + 1;
    await getAllProductsByAdminRefetch({ input: productsInquiry });
    setProductsInquiry({ ...productsInquiry });
  };

  const changeRowsPerPageHandler = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    productsInquiry.limit = parseInt(event.target.value, 10);
    productsInquiry.page = 1;
    await getAllProductsByAdminRefetch({ input: productsInquiry });
    setProductsInquiry({ ...productsInquiry });
  };

  const menuIconClickHandler = (e: any, index: number) => {
    const tempAnchor = anchorEl.slice();
    tempAnchor[index] = e.currentTarget;
    setAnchorEl(tempAnchor);
  };

  const menuIconCloseHandler = () => {
    setAnchorEl([]);
  };

  const tabChangeHandler = async (event: any, newValue: string) => {
    setValue(newValue);

    setProductsInquiry({ ...productsInquiry, page: 1, sort: "createdAt" });

    switch (newValue) {
      case "ACTIVE":
        setProductsInquiry({
          ...productsInquiry,
          search: { productStatus: ProductStatus.ACTIVE },
        });
        break;
      case "SOLD":
        setProductsInquiry({
          ...productsInquiry,
          search: { productStatus: ProductStatus.SOLD },
        });
        break;
      case "DELETE":
        setProductsInquiry({
          ...productsInquiry,
          search: { productStatus: ProductStatus.DELETE },
        });
        break;
      default:
        setProductsInquiry({
          ...productsInquiry,
          search: {},
        });
        break;
    }
  };

  const removeProductHandler = async (id: string) => {
    try {
      if (!id || id.trim() === "") {
        sweetErrorHandling(new Error("Invalid product ID")).then();
        return;
      }

      if (await sweetConfirmAlert("Are you sure to remove?")) {
        await removeProductByAdmin({ variables: { input: id } });
        await getAllProductsByAdminRefetch({ input: productsInquiry });
        menuIconCloseHandler();
      }
    } catch (err: any) {
      sweetErrorHandling(err).then();
    }
  };

  const searchTypeHandler = async (newValue: string) => {
    try {
      setSearchType(newValue);

      if (newValue !== "ALL") {
        setProductsInquiry({
          ...productsInquiry,
          page: 1,
          sort: "createdAt",
          search: {
            ...productsInquiry.search,
            typeList: [newValue as ProductType],
          },
        });
      } else {
        setProductsInquiry({
          ...productsInquiry,
          search: {
            ...productsInquiry.search,
            typeList: undefined,
          },
        });
      }
    } catch (err: any) {
      console.log("searchTypeHandler: ", err.message);
    }
  };

  const updateProductHandler = async (updateData: ProductUpdate) => {
    try {
      console.log("+updateData: ", updateData);
      await updateProductByAdmin({ variables: { input: updateData } });
      menuIconCloseHandler();
      await getAllProductsByAdminRefetch({ input: productsInquiry });
    } catch (err: any) {
      menuIconCloseHandler();
      sweetErrorHandling(err).then();
    }
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Product Management
        </h1>
        <p className="text-gray-600">Manage products and inventory</p>
      </div>

      {/* Debug Information */}
      {getAllProductsByAdminError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            GraphQL Error:
          </h3>
          <p className="text-red-700 text-sm mb-2">
            {getAllProductsByAdminError.message}
          </p>
          {getAllProductsByAdminError.networkError && (
            <p className="text-red-700 text-sm mb-2">
              Network Error: {getAllProductsByAdminError.networkError.message}
            </p>
          )}
          {getAllProductsByAdminError.graphQLErrors?.map((err, index) => (
            <p key={index} className="text-red-700 text-sm">
              GraphQL Error {index + 1}: {err.message}
            </p>
          ))}
        </div>
      )}

      {getAllProductsByAdminLoading && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-blue-800 font-medium">Loading products...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 p-1">
            <button
              onClick={(e: any) => tabChangeHandler(e, "ALL")}
              className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                value === "ALL"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              All Products
            </button>
            <button
              onClick={(e: any) => tabChangeHandler(e, "ACTIVE")}
              className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                value === "ACTIVE"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              Active
            </button>
            <button
              onClick={(e: any) => tabChangeHandler(e, "SOLD")}
              className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                value === "SOLD"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              Sold
            </button>
            <button
              onClick={(e: any) => tabChangeHandler(e, "DELETE")}
              className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                value === "DELETE"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              Deleted
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Type:</label>
            <select
              value={searchType}
              onChange={(e) => searchTypeHandler(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
            >
              <option value="ALL">All Types</option>
              {Object.values(ProductType).map((type: string) => (
                <option value={type} key={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product List */}
        <div className="p-6">
          <ProductPanelList
            products={products}
            anchorEl={anchorEl}
            menuIconClickHandler={menuIconClickHandler}
            menuIconCloseHandler={menuIconCloseHandler}
            updateProductHandler={updateProductHandler}
            removeProductHandler={removeProductHandler}
          />
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm text-gray-700">Rows per page:</label>
              <select
                value={productsInquiry?.limit}
                onChange={changeRowsPerPageHandler}
                className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {[10, 20, 40, 60].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={(e: any) =>
                  changePageHandler(
                    e,
                    Math.max(0, (productsInquiry?.page || 1) - 2)
                  )
                }
                disabled={productsInquiry?.page <= 1}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Previous
              </button>

              <span className="text-sm text-gray-700">
                Page {productsInquiry?.page} of{" "}
                {Math.ceil(
                  (productsTotal || 0) / (productsInquiry?.limit || 10)
                )}
              </span>

              <button
                onClick={(e: any) =>
                  changePageHandler(e, productsInquiry?.page || 1)
                }
                disabled={
                  (productsInquiry?.page || 1) >=
                  Math.ceil(
                    (productsTotal || 0) / (productsInquiry?.limit || 10)
                  )
                }
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAdminLayout(AdminProducts);
