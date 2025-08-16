import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Button, Stack, Typography } from "@mui/material";
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
  const device = useDeviceDetect();
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

  const {
    loading: getProductLoading,
    data: getProductData,
    error: getProductError,
    refetch: getProductRefetch,
  } = useQuery(GET_PRODUCT, {
    fetchPolicy: "network-only",
    variables: { input: router.query.productId },
  });

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
          query: `mutation ImagesUploader($files: [Upload!]!, $target: String!) { 
						imagesUploader(files: $files, target: $target)
				  }`,
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

      console.log("+responseImages: ", responseImages);
      setInsertProductData({
        ...insertProductData,
        productImages: responseImages,
      });
    } catch (err: any) {
      console.log("err: ", err.message);
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
      const result = await createProduct({
        variables: {
          input: insertProductData,
        },
      });
      await sweetMixinSuccessAlert("created successfully");

      await router.push({
        pathname: "/mypage",
        query: {
          category: "myProducts",
        },
      });
    } catch (error) {
      await sweetErrorHandling(error).then();
    }
  }, [insertProductData]);

  const updateProductHandler = useCallback(async () => {
    try {
      // @ts-ignore
      insertProductData._id = getProductData?.getProduct?._id;
      const result = await updateProduct({
        variables: {
          input: insertProductData,
        },
      });
      await sweetMixinSuccessAlert("updated successfully");

      await router.push({
        pathname: "/mypage",
        query: {
          category: "myProducts",
        },
      });
    } catch (error) {
      await sweetErrorHandling(error).then();
    }
  }, [insertProductData]);

  if (user?.memberType !== "ARTIST") {
    router.back();
  }

  console.log("+insertProductData", insertProductData);

  if (device === "mobile") {
    return <div>ADD NEW PRODUCT MOBILE PAGE</div>;
  } else {
    return (
      <div id="add-product-page">
        <Stack className="main-title-box">
          <Typography className="main-title">Add New Product</Typography>
          <Typography className="sub-title">
            We are glad to see you again!
          </Typography>
        </Stack>

        <div>
          <Stack className="config">
            <Stack className="description-box">
              <Stack className="config-column">
                <Typography className="title">Title</Typography>
                <input
                  type="text"
                  className="description-input"
                  placeholder={"Title"}
                  value={insertProductData.productTitle}
                  onChange={({ target: { value } }) =>
                    setInsertProductData({
                      ...insertProductData,
                      productTitle: value,
                    })
                  }
                />
              </Stack>

              <Stack className="config-row">
                <Stack className="price-year-after-price">
                  <Typography className="title">Price</Typography>
                  <input
                    type="text"
                    className="description-input"
                    placeholder={"Price"}
                    value={insertProductData.productPrice}
                    onChange={({ target: { value } }) =>
                      setInsertProductData({
                        ...insertProductData,
                        productPrice: parseInt(value),
                      })
                    }
                  />
                </Stack>
                <Stack className="price-year-after-price">
                  <Typography className="title">Select Type</Typography>
                  <select
                    className={"select-description"}
                    defaultValue={insertProductData.productType || "select"}
                    value={insertProductData.productType || "select"}
                    onChange={({ target: { value } }) =>
                      setInsertProductData({
                        ...insertProductData,
                        productType: value,
                      })
                    }
                  >
                    <>
                      <option selected={true} disabled={true} value={"select"}>
                        Select
                      </option>
                      {productType.map((type: any) => (
                        <option value={`${type}`} key={type}>
                          {type}
                        </option>
                      ))}
                    </>
                  </select>
                  <div className={"divider"}></div>
                  <img src={"/img/icons/Vector.svg"} className={"arrow-down"} />
                </Stack>
              </Stack>

              <Stack className="config-row">
                <Stack className="price-year-after-price">
                  <Typography className="title">Description</Typography>
                  <input
                    type="text"
                    className="description-input"
                    placeholder={"Description"}
                    value={insertProductData.productDesc}
                    onChange={({ target: { value } }) =>
                      setInsertProductData({
                        ...insertProductData,
                        productDesc: value,
                      })
                    }
                  />
                </Stack>
              </Stack>

              <Typography className="product-title">
                Product Description
              </Typography>
              <Stack className="config-column">
                <Typography className="title">Description</Typography>
                <textarea
                  name=""
                  id=""
                  className="description-text"
                  value={insertProductData.productDesc}
                  onChange={({ target: { value } }) =>
                    setInsertProductData({
                      ...insertProductData,
                      productDesc: value,
                    })
                  }
                ></textarea>
              </Stack>
            </Stack>

            <Typography className="upload-title">
              Upload photos of your product
            </Typography>
            <Stack className="images-box">
              <Stack className="upload-box">
                {/* upload UI omitted for brevity */}
                <Button
                  className="browse-button"
                  onClick={() => {
                    inputRef.current.click();
                  }}
                >
                  <Typography className="browse-button-text">
                    Browse Files
                  </Typography>
                  <input
                    ref={inputRef}
                    type="file"
                    hidden={true}
                    onChange={uploadImages}
                    multiple={true}
                    accept="image/jpg, image/jpeg, image/png"
                  />
                </Button>
              </Stack>
              <Stack className="gallery-box">
                {insertProductData?.productImages?.map((image: string) => {
                  const imagePath: string = `${REACT_APP_API_URL}/${image}`;
                  return (
                    <Stack className="image-box">
                      <img src={imagePath} alt="" />
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>

            <Stack className="buttons-row">
              {router.query.productId ? (
                <Button
                  className="next-button"
                  disabled={doDisabledCheck()}
                  onClick={updateProductHandler}
                >
                  <Typography className="next-button-text">Save</Typography>
                </Button>
              ) : (
                <Button
                  className="next-button"
                  disabled={doDisabledCheck()}
                  onClick={insertProductHandler}
                >
                  <Typography className="next-button-text">Save</Typography>
                </Button>
              )}
            </Stack>
          </Stack>
        </div>
      </div>
    );
  }
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
