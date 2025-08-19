import React, { useState } from "react";
import { NextPage } from "next";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import { ArticlesInquiry } from "../../types/board-article/board-article.input";
import { T } from "../../types/common";
import { BoardArticle } from "../../types/board-article/board-article";
import { LIKE_TARGET_BOARD_ARTICLE } from "../../../apollo/user/mutation";
import { GET_BOARD_ARTICLES } from "../../../apollo/user/query";
import {
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "../../sweetAlert";
import { Messages } from "../../config";
import { BoardArticleCategory } from "@/libs/enums/board-article.enum";
import CommunityCard from "../common/CommunityCard";

const DEFAULT_INPUT: ArticlesInquiry = {
  page: 1,
  limit: 10,
  sort: "createdAt",
  direction: "DESC" as any,
  search: { articleCategory: BoardArticleCategory.FREE },
};

const MyArticles: NextPage = ({
  initialInput = DEFAULT_INPUT,
  ...props
}: T) => {
  const user = useReactiveVar(userVar);
  const [searchCommunity, setSearchCommunity] = useState({
    ...initialInput,
    search: { ...initialInput.search, memberId: user._id },
  });
  const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  /** APOLLO REQUESTS **/
  const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

  const {
    loading: boardArticlesLoading,
    data: boardArticlesData,
    error: getBoardArticlesError,
    refetch: boardArticlesRefetch,
  } = useQuery(GET_BOARD_ARTICLES, {
    fetchPolicy: "cache-and-network",
    variables: {
      input: searchCommunity,
    },
    notifyOnNetworkStatusChange: false,
    onCompleted: (data: T) => {
      setBoardArticles(data?.getBoardArticles?.list);
      setTotalCount(data?.getBoardArticles?.metaCounter?.total);
    },
  });

  /** HANDLERS **/
  const paginationHandler = (page: number) => {
    setSearchCommunity({ ...searchCommunity, page });
  };

  const likeBoArticleHandler = async (e: any, user: any, id: string) => {
    try {
      e.stopPropagation();
      if (!id) return;
      if (!user?._id) throw new Error(Messages.error2);

      await likeTargetBoardArticle({ variables: { input: id } });
      await boardArticlesRefetch({ input: searchCommunity });
      await sweetTopSmallSuccessAlert("Success!", 750);
    } catch (err: any) {
      console.log("ERROR, likeBoArticleHandler:", err.message);
      sweetMixinErrorAlert(err.message).then();
    }
  };

  const totalPages = Math.ceil(totalCount / searchCommunity.limit);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
          My Articles
        </h1>
        <p className="text-sm text-gray-500">We are happy to see you again!</p>
      </div>

      <div className="space-y-4 mb-8">
        {boardArticles?.length > 0 ? (
          boardArticles?.map((boardArticle: BoardArticle) => (
            <CommunityCard
              likeBoArticleHandler={likeBoArticleHandler}
              boardArticle={boardArticle}
              key={boardArticle?._id}
              size={"small"}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <img
              src="/img/icons/icoAlert.svg"
              alt=""
              className="w-16 h-16 opacity-50"
            />
            <p className="text-gray-500 text-center">No Articles found!</p>
          </div>
        )}
      </div>

      {boardArticles?.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => paginationHandler(searchCommunity.page - 1)}
              disabled={searchCommunity.page <= 1}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => paginationHandler(page)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  page === searchCommunity.page
                    ? "bg-[#ff6b81] text-white"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => paginationHandler(searchCommunity.page + 1)}
              disabled={searchCommunity.page >= totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="text-sm text-gray-500">
            Total {totalCount ?? 0} article(s) available
          </div>
        </div>
      )}
    </div>
  );
};

export default MyArticles;
