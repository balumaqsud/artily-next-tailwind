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
} from "../../apollo/user/mutation";
import { T } from "../../libs/types/common";
import {
  GET_COMMENTS,
  GET_MEMBER,
  GET_PRODUCTS,
} from "../../apollo/user/query";
import { Direction, Message } from "../../libs/enums/common.enum";

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
  const [agent, setAgent] = useState<Member | null>(null);
  const [searchFilter, setSearchFilter] =
    useState<ProductsInquiry>(initialInput);
  const [agentProperties, setAgentProperties] = useState<Product[]>([]);
  const [propertyTotal, setPropertyTotal] = useState<number>(0);
  const [commentInquiry, setCommentInquiry] =
    useState<CommentsInquiry>(initialComment);
  const [agentComments, setAgentComments] = useState<Comment[]>([]);
  const [commentTotal, setCommentTotal] = useState<number>(0);
  const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
    commentGroup: CommentGroup.MEMBER,
    commentContent: "",
    commentRefId: "",
  });

  /** APOLLO REQUESTS **/
  const [createComment] = useMutation(CREATE_COMMENT);
  const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

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
      setAgent(data?.getMember);
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
      setAgentProperties(data?.getProperties?.list);
      setPropertyTotal(data?.getProperties?.metaCounter[0]?.total ?? 0);
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
      setAgentComments(data?.getComments?.list);
      setCommentTotal(data?.getComments?.metaCounter[0]?.total ?? 0);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    if (router.query.agentId) setMbId(router.query.agentId as string);
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
  const likeTargetAgentHandler = async (user: T, id: string) => {
    try {
      if (!id) return;

      if (!user._id) throw new Error(Messages.error2);

      //important
      await likeTargetProduct({ variables: { input: id } });

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

  const propertyPaginationChangeHandler = async (
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
      if (user._id === mbId) throw new Error("cant comment on yourselft");
      await createComment({ variables: { input: insertCommentData } });

      setInsertCommentData({ ...insertCommentData, commentContent: "" });
      await getCommentsRefetch({ input: commentInquiry });
    } catch (error) {
      sweetErrorHandling(error);
    }
  };

  return (
    <div className="w-full bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Artist header */}
        <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <img
            src={
              agent?.memberImage
                ? `${REACT_APP_API_URL}/${agent?.memberImage}`
                : "/img/profile/defaultUser.svg"
            }
            alt="artist"
            className="h-16 w-16 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-semibold text-gray-900">
              {agent?.memberFullName ?? agent?.memberNick}
            </p>
            <div className="mt-1 flex items-center gap-1 text-sm text-gray-600">
              <img src="/img/icons/call.svg" alt="phone" className="h-4 w-4" />
              <span>{agent?.memberPhone}</span>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-semibold text-gray-700">Products</h2>
          {agentProperties.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {agentProperties.map((product: Product) => (
                <div key={product?._id.toString()} className="">
                  <ProductBigCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-white p-10 text-center">
              <img
                src="/img/icons/icoAlert.svg"
                alt=""
                className="mb-3 h-10 w-10 opacity-60"
              />
              <p className="text-sm text-gray-600">No products found!</p>
            </div>
          )}

          {/* Products pagination */}
          {propertyTotal > 0 && (
            <div className="mt-4 flex flex-col items-center justify-center gap-2">
              <Pagination
                page={searchFilter.page}
                count={Math.ceil(propertyTotal / searchFilter.limit) || 1}
                onChange={propertyPaginationChangeHandler}
                shape="circular"
                color="primary"
              />
              <span className="text-xs text-gray-500">
                Total {propertyTotal} product{propertyTotal > 1 ? "s" : ""}{" "}
                available
              </span>
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="mt-10">
          <div className="mb-3">
            <span className="text-lg font-semibold text-gray-900">Reviews</span>
            <p className="text-sm text-gray-500">
              We are glad to see you again
            </p>
          </div>
          {commentTotal !== 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-sm text-gray-700">
                <StarIcon fontSize="small" />
                <span>
                  {commentTotal} review{commentTotal > 1 ? "s" : ""}
                </span>
              </div>
              <div className="space-y-3">
                {agentComments?.map((comment: Comment) => (
                  <ReviewCard comment={comment} key={comment?._id} />
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center">
                <Pagination
                  page={commentInquiry.page}
                  count={Math.ceil(commentTotal / commentInquiry.limit) || 1}
                  onChange={commentPaginationChangeHandler}
                  shape="circular"
                  color="primary"
                />
              </div>
            </div>
          )}

          {/* Leave review */}
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">
              Leave a Review
            </h3>
            <label className="mt-3 block text-xs font-medium text-gray-700">
              Review
            </label>
            <textarea
              onChange={({ target: { value } }: any) => {
                setInsertCommentData({
                  ...insertCommentData,
                  commentContent: value,
                });
              }}
              value={insertCommentData.commentContent}
              className="mt-1 w-full rounded-md border border-gray-200 bg-white p-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              rows={4}
            />
            <div className="mt-3 flex justify-end">
              <button
                disabled={
                  insertCommentData.commentContent === "" || user?._id === ""
                }
                onClick={createCommentHandler}
                className="inline-flex items-center rounded-md bg-[#ff6b81] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
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
      </div>
    </div>
  );
};

// Defaults applied via parameter defaults

export default withLayoutBasic(SellerDetail);
