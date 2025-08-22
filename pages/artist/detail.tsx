import React, { ChangeEvent, useEffect, useState } from "react";
import { NextPage } from "next";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import ProductBigCard from "../../libs/components/common/ProductBigCard";
import ReviewCard from "../../libs/components/artist/ReviewCard";
import { Pagination } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { useRouter } from "next/router";
import { Product } from "../../libs/types/product/product";
import { Member } from "../../libs/types/member/member";
import {
  sweetErrorHandling,
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "../../libs/sweetAlert";
import { userVar } from "../../apollo/store";
import { ProductsInquiry } from "../../libs/types/product/product.input";
import {
  CommentInput,
  CommentsInquiry,
} from "../../libs/types/comment/comment.input";
import { Comment } from "../../libs/types/comment/comment";
import { CommentGroup } from "../../libs/enums/comment.enum";
import { Messages, REACT_APP_API_URL } from "../../libs/config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  CREATE_COMMENT,
  LIKE_TARGET_PRODUCT,
  UPDATE_COMMENT,
  REMOVE_COMMENT,
} from "../../apollo/user/mutation";
import { T } from "../../libs/types/common";
import {
  GET_COMMENTS,
  GET_MEMBER,
  GET_PRODUCTS,
} from "../../apollo/user/query";
import { SUBSCRIBE, UNSUBSCRIBE } from "../../apollo/user/mutation";
import { Direction, Message } from "../../libs/enums/common.enum";
import ProductCard from "@/libs/components/product/ProductCard";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const DEFAULT_PRODUCT_INPUT: ProductsInquiry = {
  page: 1,
  limit: 9,
  sort: "createdAt",
  search: {
    memberId: "",
  },
};

const DEFAULT_COMMENT_INPUT: CommentsInquiry = {
  page: 1,
  limit: 5,
  sort: "createdAt",
  direction: Direction.ASC,
  search: {
    commentRefId: "",
  },
};

const SellerDetail: NextPage = ({
  initialInput = DEFAULT_PRODUCT_INPUT,
  initialComment = DEFAULT_COMMENT_INPUT,
  ...props
}: any) => {
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const [mbId, setMbId] = useState<string | null>(null);
  const [artist, setartist] = useState<Member | null>(null);
  const [searchFilter, setSearchFilter] =
    useState<ProductsInquiry>(initialInput);
  const [artistProducts, setArtistProducts] = useState<Product[]>([]);
  const [productTotal, setProductsTotal] = useState<number>(0);
  const [commentInquiry, setCommentInquiry] =
    useState<CommentsInquiry>(initialComment);
  const [artistComments, setArtistComments] = useState<Comment[]>([]);
  const [commentTotal, setCommentTotal] = useState<number>(0);
  const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
    commentGroup: CommentGroup.MEMBER,
    commentContent: "",
    commentRefId: "",
  });

  /** APOLLO REQUESTS **/
  const [createComment] = useMutation(CREATE_COMMENT);
  const [updateComment] = useMutation(UPDATE_COMMENT);
  const [removeComment] = useMutation(REMOVE_COMMENT);
  const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);
  const [followArtist] = useMutation(SUBSCRIBE);
  const [unfollowArtist] = useMutation(UNSUBSCRIBE);

  const {
    loading: getMemberLoading,
    data: getMemberData,
    error: getMemberError,
    refetch: getMemberRefetch,
  } = useQuery(GET_MEMBER, {
    fetchPolicy: "network-only",
    variables: { input: mbId },
    skip: !mbId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setartist(data?.getMember);
      setSearchFilter({
        ...searchFilter,
        search: { memberId: data.getMember?._id },
      });
      setCommentInquiry({
        ...commentInquiry,
        search: { commentRefId: data.getMember?._id },
      });
      setInsertCommentData({
        ...insertCommentData,
        commentRefId: data.getMember?._id,
      });
    },
  });

  const {
    loading: getPropertiesLoading,
    data: getPropertiesData,
    error: getPropertiesError,
    refetch: getPropertiesRefetch,
  } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "network-only",
    variables: { input: searchFilter },
    skip: !searchFilter.search.memberId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setArtistProducts(data?.getProducts?.list);
      setProductsTotal(data?.getProducts?.metaCounter[0]?.total ?? 0);
    },
  });

  const {
    loading: getCommentsLoading,
    data: getCommentsData,
    error: getCommentsError,
    refetch: getCommentsRefetch,
  } = useQuery(GET_COMMENTS, {
    fetchPolicy: "network-only",
    variables: { input: commentInquiry },
    skip: !commentInquiry.search.commentRefId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setArtistComments(data?.getComments?.list);
      setCommentTotal(data?.getComments?.metaCounter[0]?.total ?? 0);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    if (router.query.artistId) setMbId(router.query.artistId as string);
  }, [router]);

  useEffect(() => {
    if (searchFilter.search.memberId) {
      getPropertiesRefetch({ variables: { input: searchFilter } }).then();
    }
  }, [searchFilter]);
  useEffect(() => {
    if (commentInquiry.search.commentRefId) {
      getCommentsRefetch({ variables: { input: commentInquiry } }).then();
    }
  }, [commentInquiry]);

  /** HANDLERS **/
  const likeTargetSellerHandler = async (user: T, id: string) => {
    try {
      if (!id) return;

      if (!user._id) throw new Error(Messages.error2);

      //important
      await likeTargetProduct({ variables: { productId: id } });

      //refetch
      if (mbId) await getMemberRefetch({ input: mbId });
      await sweetTopSmallSuccessAlert("success", 800);
    } catch (error: any) {
      console.log("likeTargetProperty", error);
      sweetMixinErrorAlert(error.message).then();
    }
  };

  const redirectToMemberPageHandler = async (memberId: string) => {
    try {
      if (memberId === user?._id)
        await router.push(`/mypage?memberId=${memberId}`);
      else await router.push(`/member?memberId=${memberId}`);
    } catch (error) {
      await sweetErrorHandling(error);
    }
  };

  const productPaginationChangeHandler = async (
    event: ChangeEvent<unknown>,
    value: number
  ) => {
    searchFilter.page = value;
    setSearchFilter({ ...searchFilter });
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
      if (user._id === mbId) throw new Error("cant comment on yourself");
      await createComment({ variables: { input: insertCommentData } });

      setInsertCommentData({ ...insertCommentData, commentContent: "" });
      await getCommentsRefetch({ input: commentInquiry });
      await sweetTopSmallSuccessAlert("success", 800);
    } catch (error) {
      sweetErrorHandling(error);
    }
  };

  const removeCommentHandler = async (commentId: string) => {
    try {
      await removeComment({ variables: { input: commentId } });
      await getCommentsRefetch({ input: commentInquiry });
      await sweetTopSmallSuccessAlert("Review removed successfully!", 800);
    } catch (error) {
      sweetErrorHandling(error);
    }
  };

  const updateCommentHandler = async (
    commentId: string,
    newContent: string
  ) => {
    try {
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

      await updateComment({
        variables: {
          input: {
            _id: commentId,
            commentContent: newContent,
          },
        },
      });

      await getCommentsRefetch({ input: commentInquiry });
      await sweetTopSmallSuccessAlert("Review updated successfully!", 800);
    } catch (error) {
      sweetErrorHandling(error);
    }
  };

  const followHandler = async () => {
    try {
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

      await followArtist({ variables: { input: artist?._id } });
      await sweetTopSmallSuccessAlert("Followed successfully!", 800);

      // Refetch artist data to update follow status and follower count
      await getMemberRefetch({ input: mbId });
    } catch (error) {
      sweetErrorHandling(error);
    }
  };

  const unfollowHandler = async () => {
    try {
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

      await unfollowArtist({ variables: { input: artist?._id } });
      await sweetTopSmallSuccessAlert("Unfollowed successfully!", 800);

      // Refetch artist data to update follow status and follower count
      await getMemberRefetch({ input: mbId });
    } catch (error) {
      sweetErrorHandling(error);
    }
  };

  return (
    <div className="w-full bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Artist Profile Header */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="relative h-48 bg-gradient-to-r from-pink-100 to-purple-100 sm:h-64">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-end gap-4">
                <div className="relative">
                  <img
                    src={
                      artist?.memberImage
                        ? `${REACT_APP_API_URL}/${artist?.memberImage}`
                        : "/profile/defaultUser.svg"
                    }
                    alt="artist"
                    className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-lg sm:h-24 sm:w-24"
                  />
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 border-2 border-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-bold text-white drop-shadow-lg sm:text-2xl">
                    {artist?.memberFullName ?? artist?.memberNick}
                  </h1>
                  <p className="text-sm text-white/90 drop-shadow-sm">
                    Creative Artist & Designer
                  </p>
                  <button
                    onClick={
                      artist?.meFollowed?.some((follow) => follow.myFollowing)
                        ? unfollowHandler
                        : followHandler
                    }
                    className="rounded-full bg-white px-3 py-2 m-2 text-sm font-semibold text-gray-900 shadow hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    {artist?.meFollowed?.some((follow) => follow.myFollowing)
                      ? "Unfollow"
                      : "Follow"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-4 gap-4 sm:grid-cols-7">
              {/* Stats */}
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {artist?.memberProducts || 0}
                </div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {artist?.memberFollowers || 0}
                </div>
                <div className="text-sm text-gray-600">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {artist?.memberFollowing || 0}
                </div>
                <div className="text-sm text-gray-600">Followings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {artist?.memberArticles || 0}
                </div>
                <div className="text-sm text-gray-600">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {artist?.memberPoints || 0}
                </div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {artist?.memberLikes || 0}
                </div>
                <div className="text-sm text-gray-600">Likes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {artist?.memberViews || 0}
                </div>
                <div className="text-sm text-gray-600">Views</div>
              </div>
            </div>

            {/* Contact Info */}
            {artist?.memberPhone && (
              <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>{artist?.memberPhone}</span>
              </div>
            )}

            {/* Description */}
            {artist?.memberDesc && (
              <div className="mt-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {artist.memberDesc}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Artist's Products
              </h2>
              <p className="text-sm text-gray-600">
                Discover unique creations from this talented artist
              </p>
            </div>
            <div className="flex items-center gap-4">
              {productTotal > 0 && (
                <span className="text-sm text-gray-500">
                  {productTotal} product{productTotal > 1 ? "s" : ""} available
                </span>
              )}
            </div>
          </div>

          {artistProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {artistProducts.map((product: Product) => (
                <div key={product?._id.toString()} className="group">
                  <ProductCard
                    product={product}
                    likeTargetProductHandler={likeTargetSellerHandler}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-3">
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
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                No products yet
              </h3>
              <p className="text-sm text-gray-600">
                This artist hasn't uploaded any products yet.
              </p>
            </div>
          )}

          {/* Products pagination */}
          {productTotal > 0 &&
            Math.ceil(productTotal / searchFilter.limit) > 1 && (
              <div className="mt-8 flex flex-col items-center justify-center gap-2">
                <Pagination
                  page={searchFilter.page}
                  count={Math.ceil(productTotal / searchFilter.limit) || 1}
                  onChange={productPaginationChangeHandler}
                  shape="circular"
                  color="primary"
                />
              </div>
            )}
        </div>

        {/* Reviews Section */}
        <div className="mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Customer Reviews
            </h2>
            <p className="text-sm text-gray-600">
              What people are saying about this artist
            </p>
          </div>

          {commentTotal > 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-sm text-gray-700">
                <StarIcon className="text-yellow-400" fontSize="small" />
                <span className="font-medium">
                  {commentTotal} review{commentTotal > 1 ? "s" : ""}
                </span>
              </div>
              <div className="space-y-4">
                {artistComments?.map((comment: Comment) => (
                  <ReviewCard
                    comment={comment}
                    key={comment?._id}
                    onUpdateComment={updateCommentHandler}
                    onRemoveComment={removeCommentHandler}
                  />
                ))}
              </div>
              {Math.ceil(commentTotal / commentInquiry.limit) > 1 && (
                <div className="mt-6 flex items-center justify-center">
                  <Pagination
                    page={commentInquiry.page}
                    count={Math.ceil(commentTotal / commentInquiry.limit) || 1}
                    onChange={commentPaginationChangeHandler}
                    shape="circular"
                    color="primary"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center">
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
              <h3 className="text-lg font-semibold text-gray-900">
                No reviews yet
              </h3>
              <p className="text-sm text-gray-600">
                Be the first to leave a review for this artist!
              </p>
            </div>
          )}

          {/* Leave review form */}
          {user?._id && user._id !== mbId && (
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Leave a Review
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    onChange={({ target: { value } }: any) => {
                      setInsertCommentData({
                        ...insertCommentData,
                        commentContent: value,
                      });
                    }}
                    value={insertCommentData.commentContent}
                    placeholder="Share your experience with this artist..."
                    className="w-full rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-none"
                    rows={4}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    disabled={
                      insertCommentData.commentContent === "" || !user?._id
                    }
                    onClick={createCommentHandler}
                    className="inline-flex items-center rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:from-pink-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 transition-all duration-200"
                  >
                    Submit Review
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      className="ml-2"
                    >
                      <g clipPath="url(#clip0_6975_3642)">
                        <path
                          d="M16.1571 0.5H6.37936C6.1337 0.5 5.93491 0.698792 5.93491 0.944458C5.93491 1.19012 6.1337 1.38892 6.37936 1.38892H15.0842L0.731781 15.7413C0.558156 15.915 0.558156 16.1962 0.731781 16.3698C0.818573 16.4566 0.932323 16.5 1.04603 16.5C1.15974 16.5 1.27345 16.4566 1.36028 16.3698L15.7127 2.01737V10.7222C15.7127 10.9679 15.9115 11.1667 16.1572 11.1667C16.4028 11.1667 16.6016 10.9679 16.6016 10.7222V0.944458C16.6016 0.698792 16.4028 0.5 16.1571 0.5Z"
                          fill="#ffffff"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_6975_3642">
                          <rect
                            width="16"
                            height="16"
                            fill="white"
                            transform="translate(0.601562 0.5)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Defaults applied via parameter defaults

export default withLayoutBasic(SellerDetail);
