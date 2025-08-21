import React from "react";
import { useRouter } from "next/router";
import { Stack, Typography } from "@mui/material";
import { BoardArticle } from "../../types/board-article/board-article";
import Moment from "react-moment";
import { REACT_APP_API_URL } from "../../config";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import IconButton from "@mui/material/IconButton";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

interface CommunityCardProps {
  boardArticle: BoardArticle;
  size?: string;
  likeBoArticleHandler: any;
}

const CommunityCard = (props: CommunityCardProps) => {
  const { boardArticle, size = "normal", likeBoArticleHandler } = props;
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const imagePath: string = boardArticle?.articleImage
    ? `${REACT_APP_API_URL}/${boardArticle?.articleImage}`
    : "/img/community/communityImg.png";

  /** HANDLERS **/
  const chooseArticleHandler = (
    e: React.SyntheticEvent,
    boardArticle: BoardArticle
  ) => {
    router.push(
      {
        pathname: "/community/detail",
        query: {
          articleCategory: boardArticle?.articleCategory,
          id: boardArticle?._id,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  const goMemberPage = (id: string) => {
    if (id === user?._id) router.push("/mypage");
    else router.push(`/member?memberId=${id}`);
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01] border border-gray-100 cursor-pointer ${
        size === "small" ? "w-full" : "w-full"
      }`}
      onClick={(e: any) => chooseArticleHandler(e, boardArticle)}
    >
      {/* Image Section */}
      <div className="relative aspect-[3/2] w-full overflow-hidden">
        <img
          src={imagePath}
          alt={boardArticle?.articleTitle}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content Section */}
      <div className="p-2.5 sm:p-3">
        {/* Author and Title */}
        <div className="mb-2">
          <Typography
            className="text-xs font-medium text-pink-600 hover:text-pink-700 transition-colors cursor-pointer mb-1"
            onClick={(e: any) => {
              e.stopPropagation();
              goMemberPage(boardArticle?.memberData?._id as string);
            }}
          >
            {boardArticle?.memberData?.memberNick}
          </Typography>
          <Typography className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 group-hover:text-pink-600 transition-colors">
            {boardArticle?.articleTitle}
          </Typography>
        </div>

        {/* Stats and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* Views */}
            <div className="flex items-center gap-1 text-gray-400">
              <RemoveRedEyeIcon className="h-3 w-3" />
              <span className="text-xs font-medium">
                {boardArticle?.articleViews || 0}
              </span>
            </div>

            {/* Likes */}
            <div className="flex items-center gap-1 text-gray-400">
              <button
                className="p-0.5 hover:bg-pink-50 rounded-full transition-colors"
                onClick={(e: any) => {
                  e.stopPropagation();
                  likeBoArticleHandler(e, user, boardArticle?._id);
                }}
              >
                {boardArticle?.meLiked &&
                boardArticle?.meLiked[0]?.myFavorite ? (
                  <FavoriteIcon className="h-3 w-3 text-pink-500" />
                ) : (
                  <FavoriteBorderIcon className="h-3 w-3 text-gray-400 hover:text-pink-500 transition-colors" />
                )}
              </button>
              <span className="text-xs font-medium">
                {boardArticle?.articleLikes || 0}
              </span>
            </div>
          </div>

          {/* Date */}
          <div className="text-right">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              <Moment format="MMM">{boardArticle?.createdAt}</Moment>
            </div>
            <div className="text-sm font-bold text-gray-900">
              <Moment format="DD">{boardArticle?.createdAt}</Moment>
            </div>
          </div>
        </div>

        {/* Category Badge */}
        <div className="mt-2">
          <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600 capitalize">
            {boardArticle?.articleCategory?.toLowerCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;
