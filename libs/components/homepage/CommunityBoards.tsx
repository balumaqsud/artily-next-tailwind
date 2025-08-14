import React, { useState } from "react";
import Link from "next/link";
import CommunityCard from "./CommunityCard";
import { BoardArticle } from "../../types/board-article/board-article";
import { GET_BOARD_ARTICLES } from "../../../apollo/user/query";
import { useQuery } from "@apollo/client";
import { BoardArticleCategory } from "../../enums/board-article.enum";
import { T } from "../../types/common";

const CommunityBoards = () => {
  const [searchCommunity, setSearchCommunity] = useState({
    page: 1,
    sort: "articleViews",
    direction: "DESC",
  });
  const [newsArticles, setNewsArticles] = useState<BoardArticle[]>([]);
  const [freeArticles, setFreeArticles] = useState<BoardArticle[]>([]);

  const { refetch: refetchNews } = useQuery(GET_BOARD_ARTICLES, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        ...searchCommunity,
        limit: 6,
        search: { articleCategory: BoardArticleCategory.NEWS },
      },
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setNewsArticles(data?.getBoardArticles?.list);
    },
  });

  const { refetch: refetchFree } = useQuery(GET_BOARD_ARTICLES, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        ...searchCommunity,
        limit: 4,
        search: { articleCategory: BoardArticleCategory.FREE },
      },
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setFreeArticles(data?.getBoardArticles?.list);
    },
  });

  return (
    <section className="w-full px-4 py-10">
      <div className="mx-auto w-full max-w-7xl">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground">
          Community highlights
        </h2>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-5 px-4">
          <div className="md:col-span-3">
            <div className="mb-4 flex items-center gap-2">
              <Link
                href={"/community?articleCategory=NEWS"}
                className="text-sm font-semibold text-foreground hover:underline"
              >
                News
              </Link>
              <span className="text-muted-foreground">›</span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {newsArticles.map((article, index) => (
                <CommunityCard
                  vertical
                  article={article}
                  index={index}
                  key={article?._id}
                />
              ))}
            </div>
          </div>

          {/* Right: Free list (40%) */}
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <Link
                href={"/community?articleCategory=FREE"}
                className="text-sm font-semibold text-foreground hover:underline"
              >
                Free
              </Link>
              <span className="text-muted-foreground">›</span>
            </div>
            <div className="flex flex-col gap-3">
              {freeArticles.map((article, index) => (
                <CommunityCard
                  vertical={false}
                  article={article}
                  index={index}
                  key={article?._id}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityBoards;
