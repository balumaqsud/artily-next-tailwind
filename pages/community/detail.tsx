import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import { Backdrop, Pagination } from "@mui/material";

import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import Moment from "react-moment";
import { userVar } from "../../apollo/store";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ChatIcon from "@mui/icons-material/Chat";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import {
  CommentInput,
  CommentsInquiry,
} from "../../libs/types/comment/comment.input";
import { Comment } from "../../libs/types/comment/comment";
import dynamic from "next/dynamic";
import { CommentGroup, CommentStatus } from "../../libs/enums/comment.enum";
import { T } from "../../libs/types/common";
import EditIcon from "@mui/icons-material/Edit";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { BoardArticle } from "../../libs/types/board-article/board-article";
import { GET_BOARD_ARTICLE } from "../../apollo/user/query";
import {
  CREATE_COMMENT,
  LIKE_TARGET_BOARD_ARTICLE,
  UPDATE_COMMENT,
} from "../../apollo/user/mutation";
import { Message, Direction } from "../../libs/enums/common.enum";
import {
  sweetConfirmAlert,
  sweetMixinErrorAlert,
  sweetMixinSuccessAlert,
  sweetTopSmallSuccessAlert,
} from "../../libs/sweetAlert";
import { GET_COMMENTS } from "../../apollo/admin/query";
import { Messages } from "../../libs/config";
import { CommentUpdate } from "../../libs/types/comment/comment.update";
import StarIcon from "@mui/icons-material/Star";
import { REACT_APP_API_URL } from "../../libs/config";

const ToastViewerComponent = dynamic(
  () => import("../../libs/components/community/TViewer"),
  { ssr: false }
);

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const DEFAULT_COMMENT_INPUT: CommentsInquiry = {
  page: 1,
  limit: 5,
  sort: "createdAt",
  direction: Direction.ASC,
  search: {
    commentRefId: "",
  },
};

const CommunityDetail: NextPage = ({
  initialInput = DEFAULT_COMMENT_INPUT,
  ...props
}: T) => {
  const device = useDeviceDetect();
  const router = useRouter();
  const { query } = router;

  const articleId = query?.id as string;
  const articleCategory = query?.articleCategory as string;

  const [comment, setComment] = useState<string>("");
  const [wordsCnt, setWordsCnt] = useState<number>(0);
  const [updatedCommentWordsCnt, setUpdatedCommentWordsCnt] =
    useState<number>(0);
  const user = useReactiveVar(userVar);
  const [comments, setComments] = useState<Comment[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [searchFilter, setSearchFilter] =
    useState<CommentsInquiry>(initialInput);
  const [memberImage, setMemberImage] = useState<string>(
    "/img/community/articleImg.png"
  );
  const [anchorEl, setAnchorEl] = useState<any | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
  const [updatedComment, setUpdatedComment] = useState<string>("");
  const [updatedCommentId, setUpdatedCommentId] = useState<string>("");
  const [likeLoading, setLikeLoading] = useState<boolean>(false);
  const [boardArticle, setBoardArticle] = useState<BoardArticle>();

  /** APOLLO REQUESTS **/

  const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);
  const [createComment] = useMutation(CREATE_COMMENT);
  const [updateComment] = useMutation(UPDATE_COMMENT);

  const {
    loading: getBoardArticleLoading,
    data: getBoardArticleData,
    error: getBoardArticleError,
    refetch: getBoardArticleRefetch,
  } = useQuery(GET_BOARD_ARTICLE, {
    fetchPolicy: "cache-and-network",
    variables: { input: articleId },
    notifyOnNetworkStatusChange: true,
    skip: !articleId,
    onCompleted: (data: T) => {
      console.log("getBoardArticle data received:", data);
      setBoardArticle(data?.getArticle);
      if (data?.getArticle?.memberData?.memberImage) {
        setMemberImage(
          `${REACT_APP_API_URL}/${data?.getArticle?.memberData?.memberImage}`
        );
      }
    },
    onError: (error) => {
      console.error("getBoardArticle error:", error);
    },
  });

  const {
    loading: getCommentsLoading,
    data: getCommentsData,
    error: getCommentsError,
    refetch: getCommentsRefetch,
  } = useQuery(GET_COMMENTS, {
    fetchPolicy: "cache-and-network",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
    skip: !searchFilter.search.commentRefId,
    onCompleted: (data: T) => {
      setComments(data?.getComments?.list);
      setTotal(data?.getComments?.metaCounter[0].total ?? 0);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    if (articleId) {
      setSearchFilter({
        ...searchFilter,
        search: { commentRefId: articleId },
      });
    }
  }, [articleId]);

  useEffect(() => {
    if (searchFilter.search.commentRefId) {
      getCommentsRefetch({ input: searchFilter }).then();
    }
  }, [searchFilter]);

  /** HANDLERS **/
  const tabChangeHandler = (event: React.SyntheticEvent, value: string) => {
    router.replace(
      {
        pathname: "/community",
        query: { articleCategory: value },
      },
      "/community",
      { shallow: true }
    );
  };

  const createCommentHandler = async () => {
    if (!comment) return;
    try {
      if (!user?._id) throw new Error(Messages.error2);
      const commentInput: CommentInput = {
        commentGroup: CommentGroup.ARTICLE,
        commentRefId: articleId,
        commentContent: comment,
      };
      await createComment({
        variables: {
          input: commentInput,
        },
      });
      await getCommentsRefetch({ input: searchFilter });
      await getBoardArticleRefetch({ input: articleId });
      setComment("");
      await sweetMixinSuccessAlert("Comment added successfully!");
    } catch (error: any) {
      await sweetMixinErrorAlert(error.message);
    }
  };

  const updateButtonHandler = async (
    commentId: string,
    commentStatus?: CommentStatus.DELETE
  ) => {
    try {
      if (!user?._id) throw new Error(Messages.error2);
      if (!commentId) throw new Error("Select a comment to update!");
      if (
        updatedComment ===
        comments?.find((comment) => comment?._id === commentId)?.commentContent
      )
        return;

      const updateData: CommentUpdate = {
        _id: commentId,
        ...(commentStatus && { commentStatus }),
        ...(updatedComment && { commentContent: updatedComment }),
      };

      if (!updateData?.commentContent && !updateData?.commentStatus)
        throw new Error("Provide data to update your comment!");

      if (commentStatus) {
        if (await sweetConfirmAlert("Do you want to delete the comment?")) {
          await updateComment({
            variables: {
              input: updateData,
            },
          });
          await sweetMixinSuccessAlert("Comment deleted successfully!");
        } else return;
      } else {
        await updateComment({
          variables: {
            input: updateData,
          },
        });
        await sweetMixinSuccessAlert("Comment updated successfully!");
      }

      await getCommentsRefetch({ input: searchFilter });
    } catch (error: any) {
      await sweetMixinErrorAlert(error.message);
    } finally {
      setOpenBackdrop(false);
      setUpdatedComment("");
      setUpdatedCommentWordsCnt(0);
      setUpdatedCommentId("");
    }
  };

  const getCommentMemberImage = (imageUrl: string | undefined) => {
    if (imageUrl) return `${REACT_APP_API_URL}/${imageUrl}`;
    else return "/img/community/articleImg.png";
  };

  const goMemberPage = (id: any) => {
    if (id === user?._id) router.push("/mypage");
    else router.push(`/member?memberId=${id}`);
  };

  const cancelButtonHandler = () => {
    setOpenBackdrop(false);
    setUpdatedComment("");
    setUpdatedCommentWordsCnt(0);
  };

  const updateCommentInputHandler = (value: string) => {
    if (value.length > 100) return;
    setUpdatedCommentWordsCnt(value.length);
    setUpdatedComment(value);
  };

  const paginationHandler = (e: T, value: number) => {
    setSearchFilter({ ...searchFilter, page: value });
  };

  const likeArticleHandler = async (user: T, id: string) => {
    try {
      if (likeLoading) return;
      if (!id) return;

      if (!user._id) throw new Error(Message.SOMETHING_WENT_WRONG);

      await likeTargetBoardArticle({ variables: { input: articleId } });

      await getBoardArticleRefetch({ input: id });
      await sweetTopSmallSuccessAlert("Article liked successfully!", 800);
    } catch (error: any) {
      console.log("likeTargetArticle", error);
      sweetMixinErrorAlert(error.message).then();
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <div className="w-full bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Article Content */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              {boardArticle?.articleTitle}
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
              <span>
                <Moment format="MMMM DD, YYYY">
                  {boardArticle?.createdAt}
                </Moment>
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="capitalize">
                {boardArticle?.articleCategory?.toLowerCase()}
              </span>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-1">
                <VisibilityIcon className="h-4 w-4" />
                <span>{boardArticle?.articleViews || 0} views</span>
              </div>
            </div>
          </div>

          {/* Article Image */}
          {boardArticle?.articleImage && (
            <div className="mb-4 sm:mb-6">
              <img
                src={`${REACT_APP_API_URL}/${boardArticle.articleImage}`}
                alt={boardArticle.articleTitle}
                className="w-full rounded-lg object-cover max-h-64 sm:max-h-96"
              />
            </div>
          )}

          {/* Article Content */}
          {boardArticle?.articleContent && (
            <div className="prose prose-sm sm:prose-lg max-w-none text-gray-700 leading-relaxed">
              <ToastViewerComponent
                markdown={boardArticle.articleContent}
                className="ytb_play"
              />
            </div>
          )}

          {/* Article Actions */}
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 sm:pt-6 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  likeArticleHandler(user, boardArticle?._id as string)
                }
                disabled={likeLoading}
                className="flex items-center gap-2 transition-all duration-200 disabled:opacity-50 hover:scale-105"
              >
                <svg
                  className={`h-5 w-5 ${
                    boardArticle?.meLiked
                      ? "text-red-500 fill-current"
                      : "text-gray-400"
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
                <span className="text-sm font-medium text-gray-700">
                  {boardArticle?.articleLikes || 0}
                </span>
              </button>
              <div className="flex items-center gap-2">
                <ChatIcon className="h-4 w-4 sm:h-5 sm:w-5 text-pink-500" />
                <span className="text-sm font-medium text-gray-700">
                  {boardArticle?.articleComments || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* About the Artist */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            About the Artist
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <img
              className="h-16 w-16 rounded-full object-cover border-2 border-gray-200 cursor-pointer mx-auto sm:mx-0"
              src={
                boardArticle?.memberData?.memberImage
                  ? `${REACT_APP_API_URL}/${boardArticle?.memberData?.memberImage}`
                  : "/profile/defaultUser.svg"
              }
              alt={boardArticle?.memberData?.memberNick}
              onClick={() => goMemberPage(boardArticle?.memberData?._id)}
            />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <button
                  onClick={() => goMemberPage(boardArticle?.memberData?._id)}
                  className="text-lg font-semibold text-gray-900 hover:text-pink-600 transition-colors cursor-pointer"
                >
                  {boardArticle?.memberData?.memberFullName ||
                    boardArticle?.memberData?.memberNick}
                </button>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  {boardArticle?.memberData?.memberStatus}
                </span>
              </div>
              {boardArticle?.memberData?.memberAddress && (
                <div className="mt-1 flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-600">
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
                  {boardArticle.memberData.memberAddress}
                </div>
              )}
              {boardArticle?.memberData?.memberDesc && (
                <p className="mt-2 text-sm text-gray-600">
                  {boardArticle.memberData.memberDesc}
                </p>
              )}

              {/* Artist Stats */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {boardArticle?.memberData?.memberArticles || 0}
                  </div>
                  <div className="text-xs text-gray-600">Articles</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {boardArticle?.memberData?.memberFollowers || 0}
                  </div>
                  <div className="text-xs text-gray-600">Followers</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {boardArticle?.memberData?.memberLikes || 0}
                  </div>
                  <div className="text-xs text-gray-600">Likes</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {boardArticle?.memberData?.memberViews || 0}
                  </div>
                  <div className="text-xs text-gray-600">Views</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Customer Reviews
            </h2>
            <p className="text-sm text-gray-600">
              What people are saying about this article
            </p>
          </div>

          {total > 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-sm text-gray-700">
                <StarIcon className="text-yellow-400" fontSize="small" />
                <span className="font-medium">
                  {total} review{total > 1 ? "s" : ""}
                </span>
              </div>
              <div className="space-y-4">
                {comments?.map((commentData: Comment) => (
                  <div
                    key={commentData?._id}
                    className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={getCommentMemberImage(
                              commentData?.memberData?.memberImage
                            )}
                            alt={commentData?.memberData?.memberNick}
                            className="h-10 w-10 rounded-full object-cover border-2 border-gray-100 cursor-pointer"
                            onClick={() =>
                              goMemberPage(commentData?.memberData?._id)
                            }
                          />
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border border-white"></div>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 cursor-pointer hover:text-pink-600 transition-colors">
                            {commentData?.memberData?.memberNick}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(commentData.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {commentData?.memberId === user?._id && (
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setUpdatedCommentId(commentData?._id);
                              updateButtonHandler(
                                commentData?._id,
                                CommentStatus.DELETE
                              );
                            }}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200 transition-colors cursor-pointer"
                          >
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Remove
                          </button>
                          <button
                            onClick={() => {
                              setUpdatedComment(commentData?.commentContent);
                              setUpdatedCommentWordsCnt(
                                commentData?.commentContent?.length
                              );
                              setUpdatedCommentId(commentData?._id);
                              setOpenBackdrop(true);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                          >
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Edit
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {commentData?.commentContent}
                      </p>
                    </div>

                    {/* Updated indicator */}
                    {commentData?.updatedAt &&
                      commentData?.updatedAt !== commentData?.createdAt && (
                        <div className="mt-3 text-xs text-gray-500">
                          <span className="inline-flex items-center gap-1">
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                            Edited{" "}
                            {new Date(
                              commentData.updatedAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                  </div>
                ))}
              </div>
              {Math.ceil(total / searchFilter.limit) > 1 && (
                <div className="mt-6 flex items-center justify-center">
                  <Pagination
                    page={searchFilter.page}
                    count={Math.ceil(total / searchFilter.limit) || 1}
                    onChange={paginationHandler}
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
                Be the first to leave a review for this article!
              </p>
            </div>
          )}

          {/* Leave review form */}
          {user?._id && (
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
                    onChange={(e) => {
                      if (e.target.value.length > 100) return;
                      setWordsCnt(e.target.value.length);
                      setComment(e.target.value);
                    }}
                    value={comment}
                    placeholder="Share your thoughts about this article..."
                    className="w-full rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-none"
                    rows={4}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    disabled={comment === "" || !user?._id}
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

        {/* Edit Comment Backdrop */}
        <Backdrop
          sx={{
            top: "40%",
            right: "25%",
            left: "25%",
            width: "1000px",
            height: "fit-content",
            borderRadius: "10px",
            color: "#ffffff",
            zIndex: 999,
          }}
          open={openBackdrop}
        >
          <div className="w-full h-full bg-white border border-gray-200 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Update Comment
            </h3>
            <div className="space-y-4">
              <textarea
                autoFocus
                value={updatedComment}
                onChange={(e) => updateCommentInputHandler(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-none"
                rows={4}
                placeholder="Update your comment..."
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {updatedCommentWordsCnt}/100
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={cancelButtonHandler}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      updateButtonHandler(updatedCommentId, undefined)
                    }
                    disabled={
                      !updatedComment.trim() ||
                      updatedComment ===
                        comments?.find((c) => c._id === updatedCommentId)
                          ?.commentContent
                    }
                    className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Backdrop>
      </div>
    </div>
  );
};

export default withLayoutBasic(CommunityDetail);
