import React from "react";
import Link from "next/link";
import Moment from "react-moment";
import { BoardArticle } from "../../types/board-article/board-article";
import { REACT_APP_API_URL } from "@/libs/config";

interface CommunityCardProps {
  vertical?: boolean;
  article: BoardArticle;
  index?: number;
}

const CommunityCard = ({
  vertical = false,
  article,
  index = 0,
}: CommunityCardProps) => {
  const imagePath: string = article?.articleImage
    ? `${REACT_APP_API_URL}/${article?.articleImage}`
    : "/img/community/communityImg.png";
  if (vertical) {
    return (
      <Link
        href={`/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`}
      >
        <div className="group w-full overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-gray-100">
          <div
            className="relative aspect-[4/3] w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundImage: `url(${imagePath})` }}
          >
            <div className="absolute left-3 top-3 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm">
              #{index + 1}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="p-4">
            <h3 className="line-clamp-2 text-sm font-medium text-gray-900 leading-relaxed group-hover:text-pink-600 transition-colors duration-200">
              {article?.articleTitle}
            </h3>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <Moment format="MMM DD, YYYY">{article?.createdAt}</Moment>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="capitalize">
                {article?.articleCategory?.toLowerCase()}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`}
    >
      <div className="group flex w-full items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.01] border border-gray-100">
        <div className="relative flex-shrink-0">
          <img
            src={imagePath}
            alt={article.articleTitle}
            className="h-16 w-20 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-medium text-gray-900 leading-relaxed group-hover:text-pink-600 transition-colors duration-200">
            {article.articleTitle}
          </h3>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <Moment format="MMM DD, YYYY">{article?.createdAt}</Moment>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span className="capitalize">
              {article?.articleCategory?.toLowerCase()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CommunityCard;
