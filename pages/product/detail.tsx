import React, { ChangeEvent, useEffect, useState } from "react";
import withLayoutFull from "../../libs/components/layout/LayoutFull";
import { NextPage } from "next";
import Review from "../../libs/components/product/Review";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";
import PropertyBigCard from "../../libs/components/common/PropertyBigCard";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { useRouter } from "next/router";
import { Property } from "../../libs/types/property/property";
import moment from "moment";
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
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import "swiper/css";
import "swiper/css/pagination";
import {
  GET_COMMENTS,
  GET_PROPERTIES,
  GET_PROPERTY,
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
  LIKE_TARGET_PROPERTY,
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
  const [property, setProperty] = useState<Property | null>(null);
  const [slideImage, setSlideImage] = useState<string>("");
  const [destinationProperty, setDestinationProperty] = useState<Property[]>(
    []
  );
  const [commentInquiry, setCommentInquiry] =
    useState<CommentsInquiry>(initialComment);
  const [propertyComments, setPropertyComments] = useState<Comment[]>([]);
  const [commentTotal, setCommentTotal] = useState<number>(0);
  const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
    commentGroup: CommentGroup.PROPERTY,
    commentContent: "",
    commentRefId: "",
  });
  const [personalization, setPersonalization] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  // Unified product fields (fallback to legacy property fields)
  const title = (property as any)?.productTitle ?? property?.propertyTitle;
  const price =
    (property as any)?.productPrice ?? (property as any)?.propertyPrice;
  const images: string[] =
    ((property as any)?.productImages as string[]) ??
    ((property as any)?.propertyImages as string[]) ??
    [];
  const views =
    (property as any)?.productViews ?? (property as any)?.propertyViews;
  const likes =
    (property as any)?.productLikes ?? (property as any)?.propertyLikes;
  const location =
    (property as any)?.productLocation ?? (property as any)?.propertyLocation;
  const desc =
    (property as any)?.productDesc ?? (property as any)?.propertyDesc;
  const category =
    (property as any)?.productCategory ?? (property as any)?.propertyType;
  const productType =
    (property as any)?.productType ?? (property as any)?.propertyType;
  const productStatus = (property as any)?.productStatus;
  const shippingTime = (property as any)?.productShippingTime;
  const materials: string[] = (property as any)?.productMaterials ?? [];
  const colors: string[] = (property as any)?.productColor ?? [];
  const stock: number | null = (property as any)?.productStock ?? null;

  /** APOLLO REQUESTS **/
  const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);
  const [createComment] = useMutation(CREATE_COMMENT);

  const {
    loading: getPropertyLoading,
    data: getPropertyData,
    error: getPropertyError,
    refetch: getPropertyRefetch,
  } = useQuery(GET_PROPERTY, {
    fetchPolicy: "network-only",
    variables: { input: propertyId },
    skip: !propertyId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      if (data?.getProperty) setProperty(data?.getProperty);
      if (data?.getProperty) {
        const imgs =
          (data as any)?.getProperty?.productImages ||
          (data as any)?.getProperty?.propertyImages ||
          [];
        if (imgs[0]) setSlideImage(imgs[0]);
      }
    },
  });

  const {
    loading: getPropertiesLoading,
    data: getPropertiesData,
    error: getPropertiesError,
    refetch: getPropertiesRefetch,
  } = useQuery(GET_PROPERTIES, {
    fetchPolicy: "cache-and-network",
    variables: {
      input: {
        page: 1,
        limit: 4,
        sort: "createdAt",
        direction: Direction.DESC,
        search: {
          locationList: property?.propertyLocation
            ? [property?.propertyLocation]
            : [],
        },
      },
    },
    skip: !propertyId && !property,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      if (data?.getProperties?.list)
        setDestinationProperty(data?.getProperties?.list);
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
      await likeTargetProperty({ variables: { input: id } });

      //refetch
      await getPropertyRefetch({ input: id });

      await getPropertiesRefetch({
        input: {
          page: 1,
          limit: 4,
          sort: "createdAt",
          direction: Direction.DESC,
          search: {
            locationList: [property?.propertyLocation],
          },
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

  // Tailwind-first product detail layout (inspired by the screenshots)
  const unifiedImages =
    images && images.length ? images : slideImage ? [slideImage] : [];

  return (
    <div id="product-detail-page" className="w-full">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Gallery */}
          <div className="flex gap-3">
            <div className="hidden w-20 shrink-0 flex-col gap-2 sm:flex">
              {unifiedImages.map((img) => (
                <button
                  key={img}
                  onClick={() => changeImageHandler(img)}
                  className={`aspect-[3/4] w-20 overflow-hidden rounded-md border ${
                    slideImage === img
                      ? "border-rose-500"
                      : "border-gray-200 dark:border-neutral-800"
                  }`}
                >
                  <img
                    src={`${REACT_APP_API_URL}/${img}`}
                    alt="thumb"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
            <div className="relative w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
              <img
                src={
                  slideImage
                    ? `${REACT_APP_API_URL}/${slideImage}`
                    : unifiedImages[0]
                    ? `${REACT_APP_API_URL}/${unifiedImages[0]}`
                    : "/img/property/bigImage.png"
                }
                alt="main"
                className="h-auto w-full object-contain"
              />
              <button
                className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-sm shadow hover:bg-white"
                title="Views"
              >
                <span className="inline-block h-2 w-2 rounded-full bg-gray-700" />
                <span>{views ?? 0}</span>
              </button>
            </div>
          </div>

          {/* Product panel */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-foreground">
                {title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {location && <span>{location}</span>}
                {category && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-neutral-800">
                    {category}
                  </span>
                )}
                {productType && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-neutral-800">
                    {productType}
                  </span>
                )}
                {productStatus && (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    {productStatus}
                  </span>
                )}
              </div>
              <div className="text-3xl font-bold">
                ${price ? formatterStr(price) : "0.00"}
              </div>
            </div>

            {/* Colors */}
            {colors?.length ? (
              <div>
                <div className="mb-2 text-sm font-medium">Color</div>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`h-8 w-8 rounded-full border ${
                        selectedColor === c
                          ? "ring-2 ring-offset-2 ring-rose-500"
                          : ""
                      }`}
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {/* Materials */}
            {materials?.length ? (
              <div>
                <div className="mb-2 text-sm font-medium">Materials</div>
                <div className="flex flex-wrap gap-2">
                  {materials.map((m) => (
                    <span
                      key={m}
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs dark:bg-neutral-800"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Quantity & Stock */}
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium">Quantity</div>
              <div className="inline-flex items-center rounded-full border border-gray-200 dark:border-neutral-800">
                <button
                  className="px-3 py-1 text-lg"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span className="min-w-[3rem] text-center">{quantity}</span>
                <button
                  className="px-3 py-1 text-lg"
                  onClick={() =>
                    setQuantity((q) => Math.min(stock ?? q + 1, q + 1))
                  }
                >
                  +
                </button>
              </div>
              {typeof stock === "number" && (
                <span className="text-xs text-muted-foreground">
                  {stock} in stock
                </span>
              )}
            </div>

            {/* Personalization */}
            {(property as any)?.productPersonalizable ? (
              <div>
                <div className="mb-1 text-sm font-medium">Personalization</div>
                <textarea
                  value={personalization}
                  onChange={(e) => setPersonalization(e.target.value)}
                  className="h-24 w-full resize-none rounded-md border border-gray-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-rose-500 dark:border-neutral-800 dark:bg-neutral-900"
                  placeholder="Add personalization details (optional)"
                />
                <div className="mt-1 text-right text-xs text-muted-foreground">
                  {personalization.length}/256
                </div>
              </div>
            ) : null}

            <button className="w-full rounded-full bg-rose-500 px-6 py-3 text-center text-white shadow hover:bg-rose-600">
              Add to cart
            </button>

            <div className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 text-sm dark:divide-neutral-800 dark:border-neutral-800">
              <div className="flex items-center justify-between bg-gray-50 px-4 py-3 font-medium dark:bg-neutral-900/60">
                Item details
              </div>
              <div className="grid gap-4 px-4 py-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />{" "}
                  Handpicked
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />{" "}
                  Materials: {materials?.slice(0, 3).join(", ") || "—"}
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />{" "}
                  Shipping time: {shippingTime ?? "—"}
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500" /> Gift
                  wrapping{" "}
                  {(property as any)?.productWrapAvailable
                    ? "available"
                    : "not available"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          <div className="prose prose-sm max-w-none dark:prose-invert lg:col-span-2">
            <h2>Product description</h2>
            <p className="whitespace-pre-line">{desc ?? "No Description!"}</p>
          </div>
          <aside className="space-y-4">
            <div className="rounded-lg border border-gray-200 p-4 dark:border-neutral-800">
              <div className="mb-3 text-sm font-medium">Seller</div>
              <div className="flex items-center gap-3">
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src={
                    property?.memberData?.memberImage
                      ? `${REACT_APP_API_URL}/${property?.memberData?.memberImage}`
                      : "/img/profile/defaultUser.svg"
                  }
                  alt="seller"
                />
                <div>
                  <Link
                    href={`/member?memberId=${property?.memberData?._id}`}
                    className="font-medium hover:underline"
                  >
                    {property?.memberData?.memberNick}
                  </Link>
                  <div className="text-xs text-muted-foreground">
                    Contact seller
                  </div>
                </div>
              </div>
              <div className="mt-4 grid gap-2">
                <input
                  className="rounded-md border border-gray-200 bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-rose-500 dark:border-neutral-800 dark:bg-neutral-900"
                  placeholder="Your name"
                />
                <input
                  className="rounded-md border border-gray-200 bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-rose-500 dark:border-neutral-800 dark:bg-neutral-900"
                  placeholder="Phone"
                />
                <input
                  className="rounded-md border border-gray-200 bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-rose-500 dark:border-neutral-800 dark:bg-neutral-900"
                  placeholder="Email"
                />
                <textarea
                  className="h-24 resize-none rounded-md border border-gray-200 bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-rose-500 dark:border-neutral-800 dark:bg-neutral-900"
                  placeholder="Message"
                ></textarea>
                <button className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800">
                  Send message
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default withLayoutFull(ProductDetail);
