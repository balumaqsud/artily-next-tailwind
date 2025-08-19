import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import CommunityCard from "../common/CommunityCard";
import { T } from "../../types/common";
import { BoardArticle } from "../../types/board-article/board-article";
import { ArticlesInquiry } from "../../types/board-article/board-article.input";
import { GET_BOARD_ARTICLES } from "../../../apollo/user/query";
import { LIKE_TARGET_BOARD_ARTICLE } from "../../../apollo/user/mutation";
import { useMutation, useQuery } from "@apollo/client";
import { Messages } from "../../config";
import {
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "../../sweetAlert";
import { Direction } from "../../enums/common.enum";
import { BoardArticleCategory } from "../../enums/board-article.enum";

const DEFAULT_INPUT: ArticlesInquiry = {
  page: 1,
  limit: 6,
  sort: "createdAt",
  direction: Direction.DESC,
  search: {
    articleCategory: BoardArticleCategory.FREE,
  },
};

const MemberArticles: NextPage = ({
  initialInput = DEFAULT_INPUT,
  ...props
}: any) => {
  const router = useRouter();
  const [total, setTotal] = useState<number>(0);
  const { memberId } = router.query;
  const [searchFilter, setSearchFilter] =
    useState<ArticlesInquiry>(initialInput);
  const [memberBoArticles, setMemberBoArticles] = useState<BoardArticle[]>([]);

  /** APOLLO REQUESTS **/
  const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

  const { loading, data, error, refetch } = useQuery(GET_BOARD_ARTICLES, {
    fetchPolicy: "network-only",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: any) => {
      setMemberBoArticles(data?.getBoardArticles?.list);
      setTotal(data?.getBoardArticles?.metaCounter?.[0]?.total || 0);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    if (memberId) {
      setSearchFilter({
        ...initialInput,
        search: {
          ...(initialInput.search || {}),
          memberId: memberId as string,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId]);

  /** HANDLERS **/
  const paginationHandler = (e: T, value: number) => {
    setSearchFilter({ ...searchFilter, page: value });
  };

  const likeBoArticleHandler = async (e: any, user: any, id: string) => {
    try {
      e.stopPropagation();
      if (!id) return;
      if (!user?._id) throw new Error(Messages.error2);

      await likeTargetBoardArticle({ variables: { input: id } });
      await refetch({ input: searchFilter });
      await sweetTopSmallSuccessAlert("Success!", 750);
    } catch (err: any) {
      console.log("ERROR, likeBoArticleHandler:", err.message);
      sweetMixinErrorAlert(err.message).then();
    }
  };

  const totalPages = Math.ceil(total / (searchFilter.limit || 1));

  return (
    <div id="member-articles-page" className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Articles
        </h1>
      </div>

      <div className="space-y-4">
        {memberBoArticles?.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-white p-10 text-center">
            <img
              src="/img/icons/icoAlert.svg"
              alt=""
              className="mb-3 h-10 w-10 opacity-60"
            />
            <p className="text-sm text-gray-600">No Articles found!</p>
          </div>
        )}

        {memberBoArticles?.map((boardArticle: BoardArticle) => (
          <CommunityCard
            likeBoArticleHandler={likeBoArticleHandler}
            boardArticle={boardArticle}
            key={boardArticle?._id}
            size={"small"}
          />
        ))}
      </div>

      {memberBoArticles?.length !== 0 && (
        <div className="mt-6 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) =>
                paginationHandler(
                  e as unknown as T,
                  Math.max(1, (searchFilter.page || 1) - 1)
                )
              }
              disabled={(searchFilter.page || 1) <= 1}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={(e) => paginationHandler(e as unknown as T, page)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  page === (searchFilter.page || 1)
                    ? "bg-[#ff6b81] text-white"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={(e) =>
                paginationHandler(
                  e as unknown as T,
                  Math.min(totalPages, (searchFilter.page || 1) + 1)
                )
              }
              disabled={(searchFilter.page || 1) >= totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="text-sm text-gray-500">
            {total} article(s) available
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberArticles;
