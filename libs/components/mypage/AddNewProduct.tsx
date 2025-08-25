import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import {
  ProductType,
  ProductStatus,
  SHippingTimeType,
} from "../../enums/product.enum";
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
import { Product } from "../../types/product/product";
import { ProductInput } from "../../types/product/product.input";

const AddProduct = ({ initialValues, ...props }: any) => {
  const router = useRouter();
  const inputRef = useRef<any>(null);
  const [insertProductData, setInsertProductData] =
    useState<ProductInput>(initialValues);
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
      skip: !router.query.productId,
      onCompleted: (data: any) => {
        console.log("getProduct data:", data);
      },
      onError: (error) => {
        console.error("getProduct error:", error);
      },
    }
  );

  /** LIFECYCLES **/
  useEffect(() => {
    if (getProductData?.getProduct) {
      const product = getProductData.getProduct;
      setInsertProductData({
        productType: product.productType || ProductType.ART_COLLECTABLES,
        productCategory: product.productCategory || "",
        productLocation: product.productLocation || "",
        productShippingTime:
          product.productShippingTime || SHippingTimeType.FAST,
        productTitle: product.productTitle || "",
        productPrice: product.productPrice || 0,
        productImages: product.productImages || [],
        productMaterials: product.productMaterials || [],
        productTags: product.productTags || [],
        productStock: product.productStock || 1,
        productColor: product.productColor || [],
        productDesc: product.productDesc || "",
        productShippingCost: product.productShippingCost || 0,
        productWrapAvailable: product.productWrapAvailable || false,
        productPersonalizable: product.productPersonalizable || false,
      });
    }
  }, [getProductLoading, getProductData]);

  /** HANDLERS **/

  // Helper function to ensure arrays are properly formatted
  const ensureArrayField = (field: any): string[] => {
    if (!field) return [];
    if (Array.isArray(field)) {
      return field.filter(
        (item) => item && typeof item === "string" && item.trim().length > 0
      );
    }
    if (typeof field === "string") {
      return field
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }
    return [];
  };

  async function uploadImages() {
    try {
      const formData = new FormData();
      const selectedFiles = inputRef.current.files;

      if (selectedFiles.length == 0) return false;
      if (selectedFiles.length > 5)
        throw new Error("Cannot upload more than 5 images!");

      // Validate file types
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        if (!file.type.startsWith("image/")) {
          throw new Error(`File ${file.name} is not an image`);
        }
        if (file.size > 5 * 1024 * 1024) {
          // 5MB limit
          throw new Error(`File ${file.name} is too large (max 5MB)`);
        }
      }

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

      console.log("Uploading images...", selectedFiles.length, "files");
      const response = await axios.post(
        `${REACT_APP_API_URL}/graphql`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "apollo-require-preflight": true,
            Authorization: `Bearer ${token}`,
          },
          timeout: 30000, // 30 second timeout
        }
      );

      if (!response.data?.data?.imagesUploader) {
        throw new Error("Invalid response from image upload");
      }

      const responseImages = response.data.data.imagesUploader;
      console.log("Images uploaded successfully:", responseImages);

      setInsertProductData({
        ...insertProductData,
        productImages: responseImages,
      });
    } catch (err: any) {
      console.error("Image upload error:", err);
      await sweetMixinErrorAlert(err.message || "Failed to upload images");
    }
  }

  const doDisabledCheck = () => {
    if (
      !insertProductData?.productTitle ||
      !insertProductData?.productPrice ||
      insertProductData?.productPrice <= 0 ||
      !insertProductData?.productType ||
      !insertProductData?.productCategory ||
      !insertProductData?.productLocation ||
      !insertProductData?.productImages ||
      insertProductData?.productImages?.length < 1 ||
      !insertProductData?.productMaterials ||
      insertProductData?.productMaterials?.length < 1 ||
      !insertProductData?.productTags ||
      insertProductData?.productTags?.length < 1 ||
      !insertProductData?.productStock ||
      insertProductData?.productStock < 1 ||
      !insertProductData?.productShippingTime
    ) {
      return true;
    }
    return false;
  };

  const insertProductHandler = useCallback(async () => {
    try {
      // Ensure all required fields have proper values
      const productData = {
        productType:
          insertProductData?.productType || ProductType.ART_COLLECTABLES,
        productCategory: insertProductData?.productCategory || "",
        productLocation: insertProductData?.productLocation || "",
        productShippingTime:
          insertProductData?.productShippingTime || SHippingTimeType.FAST,
        productTitle: insertProductData?.productTitle || "",
        productPrice: insertProductData?.productPrice || 0,
        productImages: ensureArrayField(insertProductData?.productImages),
        productMaterials: ensureArrayField(insertProductData?.productMaterials),
        productTags: ensureArrayField(insertProductData?.productTags),
        productStock: insertProductData?.productStock || 1,
        productColor: ensureArrayField(insertProductData?.productColor),
        productDesc: insertProductData?.productDesc || "",
        productShippingCost: insertProductData?.productShippingCost || 0,
        productWrapAvailable: insertProductData?.productWrapAvailable || false,
        productPersonalizable:
          insertProductData?.productPersonalizable || false,
      };

      // Validate required fields before sending
      if (
        !productData.productType ||
        !productData.productCategory ||
        !productData.productLocation ||
        !productData.productTitle ||
        !productData.productPrice ||
        productData.productPrice <= 0 ||
        !productData.productImages ||
        productData.productImages.length < 1 ||
        !productData.productMaterials ||
        productData.productMaterials.length < 1 ||
        !productData.productTags ||
        productData.productTags.length < 1 ||
        !productData.productStock ||
        productData.productStock < 1 ||
        !productData.productShippingTime
      ) {
        throw new Error("Please fill in all required fields");
      }

      console.log("Sending product data:", productData);
      await createProduct({ variables: { input: productData } });
      await sweetMixinSuccessAlert("Product created successfully");
      await router.push({
        pathname: "/mypage",
        query: { category: "myProducts" },
      });
    } catch (error) {
      console.error("insertProductHandler error:", error);
      await sweetErrorHandling(error).then();
    }
  }, [insertProductData]);

  const updateProductHandler = useCallback(async () => {
    try {
      // Ensure all required fields have proper values
      const updateData = {
        _id: getProductData?.getProduct?._id,
        productType:
          insertProductData?.productType || ProductType.ART_COLLECTABLES,
        productCategory: insertProductData?.productCategory || "",
        productLocation: insertProductData?.productLocation || "",
        productShippingTime:
          insertProductData?.productShippingTime || SHippingTimeType.FAST,
        productTitle: insertProductData?.productTitle || "",
        productPrice: insertProductData?.productPrice || 0,
        productImages: ensureArrayField(insertProductData?.productImages),
        productMaterials: ensureArrayField(insertProductData?.productMaterials),
        productTags: ensureArrayField(insertProductData?.productTags),
        productStock: insertProductData?.productStock || 1,
        productColor: ensureArrayField(insertProductData?.productColor),
        productDesc: insertProductData?.productDesc || "",
        productShippingCost: insertProductData?.productShippingCost || 0,
        productWrapAvailable: insertProductData?.productWrapAvailable || false,
        productPersonalizable:
          insertProductData?.productPersonalizable || false,
      };

      // Validate required fields before sending
      if (
        !updateData._id ||
        !updateData.productType ||
        !updateData.productCategory ||
        !updateData.productLocation ||
        !updateData.productTitle ||
        !updateData.productPrice ||
        updateData.productPrice <= 0 ||
        !updateData.productImages ||
        updateData.productImages.length < 1 ||
        !updateData.productMaterials ||
        updateData.productMaterials.length < 1 ||
        !updateData.productTags ||
        updateData.productTags.length < 1 ||
        !updateData.productStock ||
        updateData.productStock < 1 ||
        !updateData.productShippingTime
      ) {
        throw new Error("Please fill in all required fields");
      }

      console.log("Sending update data:", updateData);
      await updateProduct({ variables: { input: updateData } });
      await sweetMixinSuccessAlert("Product updated successfully");
      await router.push({
        pathname: "/mypage",
        query: { category: "myProducts" },
      });
    } catch (error) {
      console.error("updateProductHandler error:", error);
      await sweetErrorHandling(error).then();
    }
  }, [insertProductData, getProductData]);

  if (user?.memberType !== "ARTIST" && user?.memberType !== "SELLER") {
    router.back();
    return null;
  }

  return (
    <div id="add-product-page" className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
          {router.query.productId ? "Edit Product" : "Add New Product"}
        </h1>
        <p className="text-sm text-gray-500">
          {router.query.productId
            ? "Update your product information"
            : "We are glad to see you again!"}
        </p>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <label className="text-xs font-medium text-gray-700">Title</label>
          <input
            type="text"
            className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            placeholder={"Product Title"}
            value={insertProductData?.productTitle || ""}
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
              value={insertProductData?.productPrice || 0}
              onChange={({ target: { value } }) =>
                setInsertProductData({
                  ...insertProductData,
                  productPrice: parseInt(value) || 0,
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
              value={insertProductData?.productType || ""}
              onChange={({ target: { value } }) =>
                setInsertProductData({
                  ...insertProductData,
                  productType: value as ProductType,
                })
              }
            >
              <option value="">Select Type</option>
              <option value={ProductType.CLOTHING}>Clothing</option>
              <option value={ProductType.HOME_LIVING}>Home & Living</option>
              <option value={ProductType.ACCESSORY}>Accessory</option>
              <option value={ProductType.HANDMADE}>Handmade</option>
              <option value={ProductType.VINTAGE}>Vintage</option>
              <option value={ProductType.CRAFT_SUPPLIES}>Craft Supplies</option>
              <option value={ProductType.JEWELRY}>Jewelry</option>
              <option value={ProductType.PET_PRODUCTS}>Pet Products</option>
              <option value={ProductType.ART_COLLECTABLES}>
                Art & Collectables
              </option>
              <option value={ProductType.CHILDREN}>Children</option>
            </select>
          </div>
        </div>

        {/* Category & Location */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <label className="text-xs font-medium text-gray-700">
              Category
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder={"Product Category"}
              value={insertProductData?.productCategory || ""}
              onChange={({ target: { value } }) =>
                setInsertProductData({
                  ...insertProductData,
                  productCategory: value,
                })
              }
            />
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <label className="text-xs font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder={"Product Location"}
              value={insertProductData?.productLocation || ""}
              onChange={({ target: { value } }) =>
                setInsertProductData({
                  ...insertProductData,
                  productLocation: value,
                })
              }
            />
          </div>
        </div>

        {/* Stock & Shipping Time */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <label className="text-xs font-medium text-gray-700">Stock</label>
            <input
              type="number"
              className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder={"Available Stock"}
              value={insertProductData?.productStock || 1}
              onChange={({ target: { value } }) =>
                setInsertProductData({
                  ...insertProductData,
                  productStock: parseInt(value) || 1,
                })
              }
            />
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <label className="text-xs font-medium text-gray-700">
              Shipping Time
            </label>
            <select
              className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
              value={insertProductData?.productShippingTime || ""}
              onChange={({ target: { value } }) =>
                setInsertProductData({
                  ...insertProductData,
                  productShippingTime: value as SHippingTimeType,
                })
              }
            >
              <option value="">Select Shipping Time</option>
              <option value={SHippingTimeType.TURBO}>24 hours</option>
              <option value={SHippingTimeType.FAST}>3-5 days</option>
              <option value={SHippingTimeType.SLOW}>7-10 days</option>
            </select>
          </div>
        </div>

        {/* Materials & Tags */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <label className="text-xs font-medium text-gray-700">
              Materials (comma separated) like: "Cotton, Polyester, etc."
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder={"Cotton, Polyester, etc."}
              value={insertProductData?.productMaterials?.join(", ") || ""}
              onChange={({ target: { value } }) =>
                setInsertProductData({
                  ...insertProductData,
                  productMaterials: value
                    .split(",")
                    .map((item) => item.trim())
                    .filter((item) => item),
                })
              }
            />
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <label className="text-xs font-medium text-gray-700">
              Tags (comma separated) like: "Summer, Casual, etc."
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder={"Summer, Casual, etc."}
              value={insertProductData?.productTags?.join(", ") || ""}
              onChange={({ target: { value } }) =>
                setInsertProductData({
                  ...insertProductData,
                  productTags: value
                    .split(",")
                    .map((item) => item.trim())
                    .filter((item) => item),
                })
              }
            />
          </div>
        </div>

        {/* Colors */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <label className="text-xs font-medium text-gray-700">
            Colors (comma separated) like: "Red, Blue, Green, etc."
          </label>
          <input
            type="text"
            className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            placeholder={"Red, Blue, Green, etc."}
            value={insertProductData?.productColor?.join(", ") || ""}
            onChange={({ target: { value } }) =>
              setInsertProductData({
                ...insertProductData,
                productColor: value
                  .split(",")
                  .map((item) => item.trim())
                  .filter((item) => item),
              })
            }
          />
        </div>

        {/* Shipping Cost & Options */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <label className="text-xs font-medium text-gray-700">
              Shipping Cost
            </label>
            <input
              type="number"
              min="0"
              step="1"
              className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder={"0.00"}
              value={insertProductData?.productShippingCost || 0}
              onChange={({ target: { value } }) =>
                setInsertProductData({
                  ...insertProductData,
                  productShippingCost: parseFloat(value) || 0,
                })
              }
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter 0 for free shipping
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="productWrapAvailable"
                className="h-4 w-4 rounded border-gray-300 text-[#ff6b81] focus:ring-[#ff6b81]"
                checked={insertProductData?.productWrapAvailable || false}
                onChange={({ target: { checked } }) =>
                  setInsertProductData({
                    ...insertProductData,
                    productWrapAvailable: checked,
                  })
                }
              />
              <label
                htmlFor="productWrapAvailable"
                className="text-sm font-medium text-gray-700"
              >
                Gift Wrapping Available
              </label>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Offer gift wrapping service
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="productPersonalizable"
                className="h-4 w-4 rounded border-gray-300 text-[#ff6b81] focus:ring-[#ff6b81]"
                checked={insertProductData?.productPersonalizable || false}
                onChange={({ target: { checked } }) =>
                  setInsertProductData({
                    ...insertProductData,
                    productPersonalizable: checked,
                  })
                }
              />
              <label
                htmlFor="productPersonalizable"
                className="text-sm font-medium text-gray-700"
              >
                Personalization Available
              </label>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Allow customer customization
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <label className="text-xs font-medium text-gray-700">
            Product Description
          </label>
          <textarea
            className="mt-1 w-full rounded-md border border-gray-200 bg-white p-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            rows={5}
            placeholder="Describe your product..."
            value={insertProductData?.productDesc || ""}
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
    productType: ProductType.ART_COLLECTABLES,
    productCategory: "",
    productLocation: "",
    productShippingTime: SHippingTimeType.FAST,
    productTitle: "",
    productPrice: 0,
    productImages: [],
    productMaterials: [],
    productTags: [],
    productStock: 1,
    productColor: [],
    productDesc: "",
    productShippingCost: 0,
    productWrapAvailable: false,
    productPersonalizable: false,
  },
};

export default AddProduct;
