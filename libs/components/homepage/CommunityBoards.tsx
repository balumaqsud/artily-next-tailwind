import React, { useState } from "react";
import Link from "next/link";
import CommunityCard from "./CommunityCard";
import { BoardArticle } from "../../types/board-article/board-article";
import { GET_BOARD_ARTICLES } from "../../../apollo/user/query";
import { useQuery } from "@apollo/client";
import { BoardArticleCategory } from "../../enums/board-article.enum";
import { T } from "../../types/common";
import { useTranslation } from "next-i18next";

const CommunityBoards = () => {
  const { t } = useTranslation("common");
  const [searchCommunity, setSearchCommunity] = useState({
    page: 1,
    limit: 8,
    sort: "createdAt",
    direction: "DESC",
    search: {},
  });
  const [newsArticles, setNewsArticles] = useState<BoardArticle[]>([]);
  const [freeArticles, setFreeArticles] = useState<BoardArticle[]>([]);

  const {
    loading: newsLoading,
    error: newsError,
    refetch: refetchNews,
  } = useQuery(GET_BOARD_ARTICLES, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        ...searchCommunity,
        limit: 6,
        search: { articleCategory: BoardArticleCategory.NEW },
      },
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      console.log("News articles data:", data);
      setNewsArticles(data?.getArticles?.list || []);
    },
    onError: (error) => {
      console.error("News articles error:", error);
    },
  });

  const {
    loading: freeLoading,
    error: freeError,
    refetch: refetchFree,
  } = useQuery(GET_BOARD_ARTICLES, {
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
      console.log("Free articles data:", data);
      setFreeArticles(data?.getArticles?.list || []);
    },
    onError: (error) => {
      console.error("Free articles error:", error);
    },
  });

  console.log("newsArticles", newsArticles);
  console.log("freeArticles", freeArticles);
  console.log("News loading:", newsLoading, "News error:", newsError);
  console.log("Free loading:", freeLoading, "Free error:", freeError);

  return (
    <section className="w-full px-6 py-10">
      <div className="mx-auto w-full max-w-7xl">
        <h2 className="text-xl mb-6 md:mb-8 md:text-2xl font-bold tracking-tight text-muted-foreground">
          {t("Community Highlights")}
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-5 px-4">
          <div className="md:col-span-3">
            <div className="mb-4 flex items-center gap-2">
              <Link
                href={"/community?articleCategory=NEWS"}
                className="text-sm font-semibold text-foreground hover:underline"
              >
                {t("News")}
              </Link>
              <span className="text-muted-foreground">›</span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {newsLoading ? (
                <div className="col-span-full text-center py-8">
                  {t("Loading news articles...")}
                </div>
              ) : newsError ? (
                <div className="col-span-full text-center py-8 text-red-500">
                  {t("Error loading news articles:")} {newsError.message}
                </div>
              ) : newsArticles && newsArticles.length > 0 ? (
                newsArticles.map((article, index) => (
                  <CommunityCard
                    vertical
                    article={article}
                    index={index}
                    key={article?._id}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  {t("No news articles found")}
                </div>
              )}
            </div>
          </div>

          {/* Right: Free list (40%) */}
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <Link
                href={"/community?articleCategory=FREE"}
                className="text-sm font-semibold text-foreground hover:underline"
              >
                {t("Free")}
              </Link>
              <span className="text-muted-foreground">›</span>
            </div>
            <div className="flex flex-col gap-3">
              {freeLoading ? (
                <div className="text-center py-8">{t("Loading free articles...")}</div>
              ) : freeError ? (
                <div className="text-center py-8 text-red-500">
                  {t("Error loading free articles:")} {freeError.message}
                </div>
              ) : freeArticles && freeArticles.length > 0 ? (
                freeArticles.map((article, index) => (
                  <CommunityCard
                    vertical={false}
                    article={article}
                    index={index}
                    key={article?._id}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {t("No free articles found")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityBoards;
