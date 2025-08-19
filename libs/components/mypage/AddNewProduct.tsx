import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { ProductType } from "../../enums/product.enum";
import { REACT_APP_API_URL } from "../../config";
import axios from "axios";
import { getJwtToken } from "../../auth";
import {
  sweetErrorHandling,
  sweetMixinErrorAlert,
  sweetMixinSuccessAlert,
} from "../../sweetAlert";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import { CREATE_PRODUCT, UPDATE_PRODUCT } from "../../../apollo/user/mutation";
import { GET_PRODUCT } from "../../../apollo/user/query";

const AddProduct = ({ initialValues, ...props }: any) => {
  const router = useRouter();
  const inputRef = useRef<any>(null);
  const [insertProductData, setInsertProductData] =
    useState<any>(initialValues);
  const [productType, setProductType] = useState<ProductType[]>(
    Object.values(ProductType)
  );
  const token = getJwtToken();
  const user = useReactiveVar(userVar);

  /** APOLLO REQUESTS **/
  const [createProduct] = useMutation(CREATE_PRODUCT);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);

  const { loading: getProductLoading, data: getProductData } = useQuery(
    GET_PRODUCT,
    {
      fetchPolicy: "network-only",
      variables: { input: router.query.productId },
    }
  );

  /** LIFECYCLES **/
  useEffect(() => {
    setInsertProductData({
      ...insertProductData,
      productTitle: getProductData?.getProduct
        ? getProductData?.getProduct?.productTitle
        : "",
      productPrice: getProductData?.getProduct
        ? getProductData?.getProduct?.productPrice
        : 0,
      productType: getProductData?.getProduct
        ? getProductData?.getProduct?.productType
        : "",
      productDesc: getProductData?.getProduct
        ? getProductData?.getProduct?.productDesc
        : "",
      productImages: getProductData?.getProduct
        ? getProductData?.getProduct?.productImages
        : [],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getProductLoading, getProductData]);

  /** HANDLERS **/
  async function uploadImages() {
    try {
      const formData = new FormData();
      const selectedFiles = inputRef.current.files;

      if (selectedFiles.length == 0) return false;
      if (selectedFiles.length > 5)
        throw new Error("Cannot upload more than 5 images!");

      formData.append(
        "operations",
        JSON.stringify({
          query: `mutation ImagesUploader($files: [Upload!]!, $target: String!) {\n            imagesUploader(files: $files, target: $target)\n          }`,
          variables: {
            files: [null, null, null, null, null],
            target: "product",
          },
        })
      );
      formData.append(
        "map",
        JSON.stringify({
          "0": ["variables.files.0"],
          "1": ["variables.files.1"],
          "2": ["variables.files.2"],
          "3": ["variables.files.3"],
          "4": ["variables.files.4"],
        })
      );
      for (const key in selectedFiles) {
        if (/^\d+$/.test(key)) formData.append(`${key}`, selectedFiles[key]);
      }

      const response = await axios.post(
        `${REACT_APP_API_URL}/graphql`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "apollo-require-preflight": true,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseImages = response.data.data.imagesUploader;
      setInsertProductData({
        ...insertProductData,
        productImages: responseImages,
      });
    } catch (err: any) {
      await sweetMixinErrorAlert(err.message);
    }
  }

  const doDisabledCheck = () => {
    if (
      insertProductData.productTitle === "" ||
      insertProductData.productPrice === 0 ||
      insertProductData.productType === "" ||
      insertProductData.productDesc === "" ||
      insertProductData.productImages.length === 0
    ) {
      return true;
    }
  };

  const insertProductHandler = useCallback(async () => {
    try {
      // @ts-ignore
      insertProductData._id = getProductData?.getProduct?._id;
      await createProduct({ variables: { input: insertProductData } });
      await sweetMixinSuccessAlert("Created successfully");
      await router.push({
        pathname: "/mypage",
        query: { category: "myProducts" },
      });
    } catch (error) {
      await sweetErrorHandling(error).then();
    }
  }, [insertProductData]);

  const updateProductHandler = useCallback(async () => {
    try {
      // @ts-ignore
      insertProductData._id = getProductData?.getProduct?._id;
      await updateProduct({ variables: { input: insertProductData } });
      await sweetMixinSuccessAlert("Updated successfully");
      await router.push({
        pathname: "/mypage",
        query: { category: "myProducts" },
      });
    } catch (error) {
      await sweetErrorHandling(error).then();
    }
  }, [insertProductData]);

  if (user?.memberType !== "ARTIST") {
    router.back();
  }

  return (
    <div id="add-product-page" className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Add New Product
        </h1>
        <p className="text-sm text-gray-500">We are glad to see you again!</p>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <label className="text-xs font-medium text-gray-700">Title</label>
          <input
            type="text"
            className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            placeholder={"Title"}
            value={insertProductData.productTitle}
            onChange={({ target: { value } }) =>
              setInsertProductData({
                ...insertProductData,
                productTitle: value,
              })
            }
          />
        </div>

        {/* Price & Type */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <label className="text-xs font-medium text-gray-700">Price</label>
            <input
              type="number"
              className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder={"Price"}
              value={insertProductData.productPrice}
              onChange={({ target: { value } }) =>
                setInsertProductData({
                  ...insertProductData,
                  productPrice: parseInt(value),
                })
              }
            />
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <label className="text-xs font-medium text-gray-700">
              Select Type
            </label>
            <select
              className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
              defaultValue={insertProductData.productType || "select"}
              value={insertProductData.productType || "select"}
              onChange={({ target: { value } }) =>
                setInsertProductData({
                  ...insertProductData,
                  productType: value,
                })
              }
            >
              <option disabled value={"select"}>
                Select
              </option>
              {productType.map((type: any) => (
                <option value={`${type}`} key={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Short Description */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <label className="text-xs font-medium text-gray-700">
            Short Description
          </label>
          <input
            type="text"
            className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            placeholder={"Description"}
            value={insertProductData.productDesc}
            onChange={({ target: { value } }) =>
              setInsertProductData({ ...insertProductData, productDesc: value })
            }
          />
        </div>

        {/* Long Description */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <label className="text-xs font-medium text-gray-700">
            Product Description
          </label>
          <textarea
            className="mt-1 w-full rounded-md border border-gray-200 bg-white p-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            rows={5}
            value={insertProductData.productDesc}
            onChange={({ target: { value } }) =>
              setInsertProductData({ ...insertProductData, productDesc: value })
            }
          />
        </div>

        {/* Images */}
        <div>
          <p className="mb-2 text-sm font-semibold text-gray-900">
            Upload photos of your product
          </p>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <button
                className="inline-flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                onClick={() => inputRef.current.click()}
              >
                Browse Files
              </button>
              <input
                ref={inputRef}
                type="file"
                hidden
                onChange={uploadImages}
                multiple
                accept="image/jpg, image/jpeg, image/png"
              />
            </div>
            {insertProductData?.productImages?.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {insertProductData?.productImages?.map((image: string) => {
                  const imagePath: string = `${REACT_APP_API_URL}/${image}`;
                  return (
                    <div
                      key={image}
                      className="h-28 w-full overflow-hidden rounded-lg bg-gray-100"
                    >
                      <img
                        src={imagePath}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          {router.query.productId ? (
            <button
              className="inline-flex items-center rounded-md bg-[#ff6b81] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={doDisabledCheck()}
              onClick={updateProductHandler}
            >
              Save
            </button>
          ) : (
            <button
              className="inline-flex items-center rounded-md bg-[#ff6b81] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={doDisabledCheck()}
              onClick={insertProductHandler}
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

AddProduct.defaultProps = {
  initialValues: {
    productTitle: "",
    productPrice: 0,
    productType: "",
    productDesc: "",
    productImages: [],
  },
};

export default AddProduct;
