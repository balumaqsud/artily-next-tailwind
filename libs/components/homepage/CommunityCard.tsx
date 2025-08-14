import React from "react";
import Link from "next/link";
import Moment from "react-moment";
import { BoardArticle } from "../../types/board-article/board-article";

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
  const articleImage = article?.articleImage
    ? `${process.env.REACT_APP_API_URL}/${article?.articleImage}`
    : "/img/event.svg";

  if (vertical) {
    return (
      <Link
        href={`/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`}
      >
        <div className="w-[240px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
          <div
            className="relative aspect-[4/3] w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${articleImage})` }}
          >
            <div className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white">
              {index + 1}
            </div>
          </div>
          <div className="p-3">
            <strong className="line-clamp-2 text-sm text-foreground">
              {article?.articleTitle}
            </strong>
            <div className="mt-1 text-xs text-muted-foreground">
              <Moment format="DD.MM.YY">{article?.createdAt}</Moment>
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
      <div className="flex w-full max-w-md items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
        <img
          src={articleImage}
          alt=""
          className="h-16 w-20 rounded-md object-cover"
        />
        <div className="min-w-0">
          <strong className="line-clamp-2 text-sm text-foreground">
            {article.articleTitle}
          </strong>
          <div className="mt-1 text-xs text-muted-foreground">
            <Moment format="DD.MM.YY">{article?.createdAt}</Moment>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CommunityCard;
