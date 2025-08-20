import React, { ChangeEvent, useEffect, useState } from "react";
import withLayoutFull from "../../libs/components/layout/LayoutFull";
import { NextPage } from "next";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { useRouter } from "next/router";
import { Product } from "../../libs/types/product/product";
import { formatterStr } from "../../libs/utils";
import { REACT_APP_API_URL } from "../../libs/config";
import { userVar } from "../../apollo/store";
import {
  CommentInput,
  CommentsInquiry,
} from "../../libs/types/comment/comment.input";
import { Comment } from "../../libs/types/comment/comment";
import { CommentGroup } from "../../libs/enums/comment.enum";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import "swiper/css";
import "swiper/css/pagination";
import {
  GET_COMMENTS,
  GET_PRODUCT,
  GET_PRODUCTS,
} from "../../apollo/user/query";
import { T } from "../../libs/types/common";
import { Direction, Message } from "../../libs/enums/common.enum";
import {
  sweetErrorHandling,
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "../../libs/sweetAlert";
import {
  CREATE_COMMENT,
  LIKE_TARGET_PRODUCT,
} from "../../apollo/user/mutation";

SwiperCore.use([Autoplay, Navigation, Pagination]);

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

type DetailProps = { initialComment?: CommentsInquiry };
const DEFAULT_COMMENT: CommentsInquiry = {
  page: 1,
  limit: 5,
  sort: "createdAt",
  direction: Direction.DESC,
  search: { commentRefId: "" },
};

const ProductDetail: NextPage<DetailProps> = ({
  initialComment = DEFAULT_COMMENT,
}: any) => {
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [product, setProperty] = useState<Product | null>(null);
  const [slideImage, setSlideImage] = useState<string>("");
  const [destinationProduct, setDestinationProduct] = useState<Product[]>([]);
  const [commentInquiry, setCommentInquiry] =
    useState<CommentsInquiry>(initialComment);
  const [propertyComments, setPropertyComments] = useState<Comment[]>([]);
  const [commentTotal, setCommentTotal] = useState<number>(0);
  const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
    commentGroup: CommentGroup.PRODUCT,
    commentContent: "",
    commentRefId: "",
  });
  const [personalization, setPersonalization] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const title =
    (product as any)?.productTitle ?? (product as any)?.propertyTitle;
  const price =
    (product as any)?.productPrice ?? (product as any)?.propertyPrice;
  const images: string[] =
    ((product as any)?.productImages as string[]) ??
    ((product as any)?.propertyImages as string[]) ??
    [];
  const views =
    (product as any)?.productViews ?? (product as any)?.propertyViews;
  const likes =
    (product as any)?.productLikes ?? (product as any)?.propertyLikes;
  const location =
    (product as any)?.productLocation ?? (product as any)?.propertyLocation;
  const desc = (product as any)?.productDesc ?? (product as any)?.propertyDesc;
  const category =
    (product as any)?.productCategory ?? (product as any)?.propertyType;
  const productType =
    (product as any)?.productType ?? (product as any)?.propertyType;
  const productStatus = (product as any)?.productStatus;
  const shippingTime = (product as any)?.productShippingTime;
  const materials: string[] = (product as any)?.productMaterials ?? [];
  const colors: string[] = (product as any)?.productColor ?? [];
  const stock: number | null = (product as any)?.productStock ?? null;

  /** APOLLO REQUESTS **/
  const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);
  const [createComment] = useMutation(CREATE_COMMENT);

  const {
    loading: getPropertyLoading,
    data: getPropertyData,
    error: getPropertyError,
    refetch: getPropertyRefetch,
  } = useQuery(GET_PRODUCT, {
    fetchPolicy: "network-only",
    variables: { input: propertyId },
    skip: !propertyId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      const p = (data as any)?.getProduct || (data as any)?.getProperty;
      if (p) setProperty(p);
      const imgs = p?.productImages || p?.propertyImages || [];
      if (imgs[0]) setSlideImage(imgs[0]);
    },
  });

  const {
    loading: getProductsLoading,
    data: getProductsData,
    error: getProductsError,
    refetch: getProductsRefetch,
  } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "cache-and-network",
    variables: {
      input: {
        page: 1,
        limit: 4,
        sort: "createdAt",
        direction: Direction.DESC,
        search: {},
      },
    },
    skip: !product,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      const list =
        (data as any)?.getProducts?.list || (data as any)?.getProperties?.list;
      if (list) setDestinationProduct(list);
    },
  });

  const {
    loading: getCommentsLoading,
    data: getCommentsData,
    error: getCommentsError,
    refetch: getCommentsRefetch,
  } = useQuery(GET_COMMENTS, {
    fetchPolicy: "cache-and-network",
    variables: {
      input: initialComment,
    },
    skip: !commentInquiry.search.commentRefId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      if (data?.getComments?.list) setPropertyComments(data?.getComments?.list);
      setCommentTotal(data?.getComments?.metaCounter[0].total ?? 0);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    if (router.query.id) {
      setPropertyId(router.query.id as string);
      setCommentInquiry({
        ...commentInquiry,
        search: {
          commentRefId: router.query.id as string,
        },
      });
      setInsertCommentData({
        ...insertCommentData,
        commentRefId: router.query.id as string,
      });
    }
  }, [router]);

  useEffect(() => {
    if (commentInquiry.search.commentRefId) {
      getCommentsRefetch({ input: commentInquiry });
    }
  }, [commentInquiry]);

  /** HANDLERS **/
  const likePropertyHandler = async (user: T, id: string) => {
    try {
      if (!id) return;

      if (!user._id) throw new Error(Message.SOMETHING_WENT_WRONG);

      //important
      await likeTargetProduct({ variables: { productId: id } });

      //refetch
      await getPropertyRefetch({ input: id });

      // Refetch related products without location filter to avoid GraphQL errors
      await getProductsRefetch({
        input: {
          page: 1,
          limit: 4,
          sort: "createdAt",
          direction: Direction.DESC,
          search: {},
        },
      });
      await sweetTopSmallSuccessAlert("success", 800);
    } catch (error: any) {
      console.log("liketargetProperty", error);
      sweetMixinErrorAlert(error.message).then();
    }
  };
  const changeImageHandler = (image: string) => {
    setSlideImage(image);
  };

  const commentPaginationChangeHandler = async (
    event: ChangeEvent<unknown>,
    value: number
  ) => {
    commentInquiry.page = value;
    setCommentInquiry({ ...commentInquiry });
  };

  const createCommentHandler = async () => {
    try {
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
      await createComment({ variables: { input: insertCommentData } });

      setInsertCommentData({ ...insertCommentData, commentContent: "" });
      await getCommentsRefetch({ input: commentInquiry });
    } catch (error) {
      sweetErrorHandling(error);
    }
  };

  if (getPropertyLoading) {
    return (
      <div className="flex h-[1080px] w-full items-center justify-center">
        <svg
          className="h-8 w-8 animate-spin text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      </div>
    );
  }

  const unifiedImages =
    images && images.length ? images : slideImage ? [slideImage] : [];

  return (
    <div className="w-full bg-background-light mt-20">
      <div className="mx-auto max-w-7xl px-8 py-8">
        <div className="flex flex-col gap-8">
          {/* Product Gallery Section */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Images and Description */}
            <div className="flex flex-col gap-6 w-full lg:w-[580px] lg:shrink-0">
              {/* Product Gallery */}
              <div className="flex gap-4">
                {/* Thumbnail Column */}
                <div className="hidden w-20 shrink-0 flex-col gap-2 sm:flex">
                  {unifiedImages.map((img, index) => (
                    <button
                      key={img}
                      onClick={() => changeImageHandler(img)}
                      className={`aspect-square w-20 overflow-hidden rounded-lg border-2 transition-all ${
                        slideImage === img
                          ? "border-pink-500"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={`${REACT_APP_API_URL}/${img}`}
                        alt={`${title} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                {/* Main Image */}
                <div className="relative flex-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm h-[400px] sm:h-[500px]">
                  <img
                    src={
                      slideImage
                        ? `${REACT_APP_API_URL}/${slideImage}`
                        : unifiedImages[0]
                        ? `${REACT_APP_API_URL}/${unifiedImages[0]}`
                        : "/banner/main.jpg"
                    }
                    alt={title}
                    className="h-[400px] sm:h-[500px] w-full object-cover"
                  />

                  {/* Like Button */}
                  <button
                    onClick={() =>
                      likePropertyHandler(user, product?._id?.toString() || "")
                    }
                    className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur hover:bg-white transition-all"
                    title="Add to favorites"
                  >
                    <svg
                      className={`h-5 w-5 ${
                        product?.meLiked?.[0]?.myFavorite
                          ? "text-red-500 fill-current"
                          : "text-gray-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>

                  {/* Views Badge */}
                  <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                    <svg
                      className="h-3 w-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {views ?? 0} views
                  </div>

                  {/* Navigation Arrows (for multiple images) */}
                  {unifiedImages.length > 1 && (
                    <>
                      <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur hover:bg-white transition-all"
                        title="Previous image"
                      >
                        <svg
                          className="h-4 w-4 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur hover:bg-white transition-all"
                        title="Next image"
                      >
                        <svg
                          className="h-4 w-4 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Product Description */}
              {product?.productDesc && (
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Product Description
                  </h3>
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <p className="whitespace-pre-line leading-relaxed">
                      {product?.productDesc}
                    </p>
                  </div>
                </div>
              )}

              {/* Mobile Thumbnail Gallery */}
              {unifiedImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto sm:hidden">
                  {unifiedImages.map((img, index) => (
                    <button
                      key={img}
                      onClick={() => changeImageHandler(img)}
                      className={`flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                        slideImage === img
                          ? "border-pink-500"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={`${REACT_APP_API_URL}/${img}`}
                        alt={`${title} ${index + 1}`}
                        className="h-16 w-16 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Product Information */}
            <div className="flex-1 space-y-6">
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    {title}
                  </h1>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">
                      ${price ? formatterStr(price) : "0.00"}
                    </div>
                    {product?.productShippingCost === 0 && (
                      <div className="text-sm text-green-600 font-medium">
                        Free shipping
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags and Categories */}
                <div className="flex flex-wrap items-center gap-2">
                  {product?.productTags?.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-800"
                    >
                      {tag}
                    </span>
                  ))}
                  {category && (
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
                      {category}
                    </span>
                  )}
                  {productType && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                      {productType}
                    </span>
                  )}
                  {productStatus && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      {productStatus}
                    </span>
                  )}
                </div>

                {/* Location */}
                {location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {location}
                  </div>
                )}
              </div>

              {/* Colors */}
              {colors?.length > 0 && (
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-gray-900">
                    Available Colors
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`relative h-10 w-10 rounded-full border-2 transition-all ${
                          selectedColor === color
                            ? "border-pink-500 ring-2 ring-pink-200"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      >
                        {selectedColor === color && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg
                              className="h-4 w-4 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Materials */}
              {materials?.length > 0 && (
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-gray-900">
                    Materials
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {materials.map((material) => (
                      <span
                        key={material}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Stock */}
              <div className="space-y-3">
                <div className="text-sm font-semibold text-gray-900">
                  Quantity
                </div>
                <div className="flex items-center gap-4">
                  <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white">
                    <button
                      className="px-4 py-2 text-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      −
                    </button>
                    <span className="min-w-[4rem] text-center font-medium">
                      {quantity}
                    </span>
                    <button
                      className="px-4 py-2 text-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                      onClick={() =>
                        setQuantity((q) => Math.min(stock ?? q + 1, q + 1))
                      }
                    >
                      +
                    </button>
                  </div>
                  {typeof stock === "number" && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{stock}</span> in stock
                    </div>
                  )}
                </div>
              </div>

              {/* Personalization */}
              {(product as any)?.productPersonalizable && (
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-gray-900">
                    Personalization
                  </div>
                  <textarea
                    value={personalization}
                    onChange={(e) => setPersonalization(e.target.value)}
                    className="h-24 w-full resize-none rounded-lg border border-gray-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                    placeholder="Add personalization details (optional)"
                    maxLength={256}
                  />
                  <div className="text-right text-xs text-gray-500">
                    {personalization.length}/256
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-4 text-center font-semibold text-white shadow-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200">
                  Add to Cart
                </button>
                <button className="w-full rounded-lg border border-gray-300 bg-white px-6 py-4 text-center font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                  Buy Now
                </button>
              </div>

              {/* Product Details */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Product Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Shipping Time</span>
                    <span className="text-sm font-medium text-gray-900">
                      {shippingTime || "Standard"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Shipping Cost</span>
                    <span className="text-sm font-medium text-gray-900">
                      {product?.productShippingCost === 0
                        ? "Free"
                        : `$${product?.productShippingCost}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Gift Wrapping</span>
                    <span className="text-sm font-medium text-gray-900">
                      {(product as any)?.productWrapAvailable
                        ? "Available"
                        : "Not available"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Personalization
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {(product as any)?.productPersonalizable
                        ? "Available"
                        : "Not available"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Product Rank</span>
                    <span className="text-sm font-medium text-gray-900">
                      {product?.productRank || "New"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seller Information */}
          <div className="mt-12 rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              About the Artist
            </h3>
            <div className="flex items-start gap-4">
              <img
                className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                src={
                  product?.memberData?.memberImage
                    ? `${REACT_APP_API_URL}/${product?.memberData?.memberImage}`
                    : "/profile/defaultUser.svg"
                }
                alt={product?.memberData?.memberNick}
              />
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/artist/detail?agentId=${product?.memberData?._id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-pink-600 transition-colors"
                  >
                    {product?.memberData?.memberFullName ||
                      product?.memberData?.memberNick}
                  </Link>
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    {product?.memberData?.memberStatus}
                  </span>
                </div>
                {product?.memberData?.memberAddress && (
                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {product.memberData.memberAddress}
                  </div>
                )}
                {product?.memberData?.memberDesc && (
                  <p className="mt-2 text-sm text-gray-600">
                    {product.memberData.memberDesc}
                  </p>
                )}

                {/* Artist Stats */}
                <div className="mt-4 grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {product?.memberData?.memberProperties || 0}
                    </div>
                    <div className="text-xs text-gray-600">Products</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {product?.memberData?.memberFollowers || 0}
                    </div>
                    <div className="text-xs text-gray-600">Followers</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {product?.memberData?.memberLikes || 0}
                    </div>
                    <div className="text-xs text-gray-600">Likes</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {product?.memberData?.memberViews || 0}
                    </div>
                    <div className="text-xs text-gray-600">Views</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-12 rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Customer Reviews
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-4 w-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {commentTotal} review{commentTotal !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {commentTotal > 0 ? (
              <div className="space-y-4">
                {propertyComments?.map((comment: Comment) => (
                  <div
                    key={comment._id}
                    className="border-b border-gray-100 pb-4 last:border-b-0"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={
                          comment.memberData?.memberImage
                            ? `${REACT_APP_API_URL}/${comment.memberData.memberImage}`
                            : "/profile/defaultUser.svg"
                        }
                        alt={comment.memberData?.memberNick}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {comment.memberData?.memberNick}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-700">
                          {comment.commentContent}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mb-4 rounded-full bg-gray-100 p-3 mx-auto w-fit">
                  <svg
                    className="h-8 w-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900">
                  No reviews yet
                </h4>
                <p className="text-sm text-gray-600">
                  Be the first to review this product!
                </p>
              </div>
            )}

            {/* Leave Review Form */}
            {user?._id && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h4 className="mb-4 font-medium text-gray-900">
                  Leave a Review
                </h4>
                <div className="space-y-3">
                  <textarea
                    value={insertCommentData.commentContent}
                    onChange={(e) =>
                      setInsertCommentData({
                        ...insertCommentData,
                        commentContent: e.target.value,
                      })
                    }
                    className="h-24 w-full resize-none rounded-lg border border-gray-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                    placeholder="Share your experience with this product..."
                  />
                  <button
                    onClick={createCommentHandler}
                    disabled={!insertCommentData.commentContent.trim()}
                    className="rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withLayoutFull(ProductDetail);
