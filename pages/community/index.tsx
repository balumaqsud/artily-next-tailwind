import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Pagination, Tab, Typography } from "@mui/material";
import CommunityCard from "../../libs/components/common/CommunityCard";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import { BoardArticle } from "../../libs/types/board-article/board-article";
import { T } from "../../libs/types/common";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ArticlesInquiry } from "../../libs/types/board-article/board-article.input";
import { BoardArticleCategory } from "../../libs/enums/board-article.enum";
import { GET_BOARD_ARTICLES } from "../../apollo/user/query";
import { useMutation, useQuery } from "@apollo/client";
import { LIKE_TARGET_BOARD_ARTICLE } from "../../apollo/user/mutation";
import { Message } from "../../libs/enums/common.enum";
import {
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "../../libs/sweetAlert";
import { Direction } from "../../libs/enums/common.enum";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const DEFAULT_INPUT: ArticlesInquiry = {
  page: 1,
  limit: 6,
  sort: "createdAt",
  direction: Direction.ASC,
  search: {
    articleCategory: "FREE" as BoardArticleCategory,
  },
};

const Community: NextPage = ({ initialInput = DEFAULT_INPUT, ...props }: T) => {
  const router = useRouter();
  const { query } = router;
  const articleCategory = query?.articleCategory as string;
  const [searchCommunity, setSearchCommunity] =
    useState<ArticlesInquiry>(initialInput);
  const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  if (articleCategory) initialInput.search.articleCategory = articleCategory;

  /** APOLLO REQUESTS **/
  const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

  const {
    loading: getBoardArticlesLoading,
    data: getBoardArticlesData,
    error: getBoardArticlesError,
    refetch: getBoardArticlesRefetch,
  } = useQuery(GET_BOARD_ARTICLES, {
    fetchPolicy: "network-only",
    variables: { input: searchCommunity },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setBoardArticles(data?.getBoardArticles?.list);
      setTotalCount(data?.getBoardArticles?.metaCounter[0].total);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    if (!query?.articleCategory)
      router.push(
        {
          pathname: router.pathname,
          query: { articleCategory: "FREE" },
        },
        router.pathname,
        { shallow: true }
      );
  }, []);

  /** HANDLERS **/
  const tabChangeHandler = async (e: T, value: string) => {
    console.log(value);

    setSearchCommunity({
      ...searchCommunity,
      page: 1,
      search: { articleCategory: value as BoardArticleCategory },
    });
    await router.push(
      {
        pathname: "/community",
        query: { articleCategory: value },
      },
      router.pathname,
      { shallow: true }
    );
  };

  const paginationHandler = (e: T, value: number) => {
    setSearchCommunity({ ...searchCommunity, page: value });
  };
  const likeArticleHandler = async (e: any, user: T, id: string) => {
    try {
      e.stopPropagation();
      if (!id) return;

      if (!user._id) throw new Error(Message.SOMETHING_WENT_WRONG);

      //important
      await likeTargetBoardArticle({ variables: { input: id } });

      //refetch
      await getBoardArticlesRefetch({ input: searchCommunity });
      await sweetTopSmallSuccessAlert("success", 800);
    } catch (error: any) {
      console.log("liketargetArticle", error);
      sweetMixinErrorAlert(error.message).then();
    }
  };

  return (
    <div className="w-full">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <TabContext value={searchCommunity.search.articleCategory}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {/* Left sidebar */}
            <div className="md:col-span-3">
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <img
                    src="/logo/artly-logo.png"
                    alt="Artly"
                    className="h-8 w-8"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Artly Community
                    </p>
                    <p className="text-xs text-gray-500">Share and discover</p>
                  </div>
                </div>
                <div className="mt-4">
                  <TabList
                    orientation="vertical"
                    aria-label="community tabs"
                    TabIndicatorProps={{ style: { display: "none" } }}
                    onChange={tabChangeHandler}
                  >
                    <Tab
                      value={"FREE"}
                      label={"Free Board"}
                      className="!items-start !justify-start !text-left"
                    />
                    <Tab
                      value={"RECOMMEND"}
                      label={"Recommendation"}
                      className="!items-start !justify-start !text-left"
                    />
                    <Tab
                      value={"NEWS"}
                      label={"News"}
                      className="!items-start !justify-start !text-left"
                    />
                    <Tab
                      value={"HUMOR"}
                      label={"Humor"}
                      className="!items-start !justify-start !text-left"
                    />
                  </TabList>
                </div>
              </div>
            </div>

            {/* Right content */}
            <div className="md:col-span-9">
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {searchCommunity.search.articleCategory} Board
                    </h2>
                    <p className="text-sm text-gray-500">
                      Express your opinions freely here without content
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      router.push({
                        pathname: "/mypage",
                        query: {
                          category: "writeArticle",
                        },
                      })
                    }
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Write
                  </button>
                </div>

                <TabPanel value="FREE" className="!p-0">
                  <div className="grid grid-cols-1 gap-4">
                    {totalCount ? (
                      boardArticles?.map((boardArticle: BoardArticle) => (
                        <CommunityCard
                          boardArticle={boardArticle}
                          key={boardArticle?._id}
                          likeBoArticleHandler={likeArticleHandler}
                        />
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-white p-10 text-center">
                        <img
                          src="/img/icons/icoAlert.svg"
                          alt=""
                          className="mb-3 h-10 w-10 opacity-60"
                        />
                        <p className="text-sm text-gray-600">
                          No Article found!
                        </p>
                      </div>
                    )}
                  </div>
                </TabPanel>

                <TabPanel value="RECOMMEND" className="!p-0">
                  <div className="grid grid-cols-1 gap-4">
                    {totalCount ? (
                      boardArticles?.map((boardArticle: BoardArticle) => (
                        <CommunityCard
                          boardArticle={boardArticle}
                          key={boardArticle?._id}
                          likeBoArticleHandler={likeArticleHandler}
                        />
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-white p-10 text-center">
                        <img
                          src="/img/icons/icoAlert.svg"
                          alt=""
                          className="mb-3 h-10 w-10 opacity-60"
                        />
                        <p className="text-sm text-gray-600">
                          No Article found!
                        </p>
                      </div>
                    )}
                  </div>
                </TabPanel>

                <TabPanel value="NEWS" className="!p-0">
                  <div className="grid grid-cols-1 gap-4">
                    {totalCount ? (
                      boardArticles?.map((boardArticle: BoardArticle) => (
                        <CommunityCard
                          likeBoArticleHandler={likeArticleHandler}
                          boardArticle={boardArticle}
                          key={boardArticle?._id}
                        />
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-white p-10 text-center">
                        <img
                          src="/img/icons/icoAlert.svg"
                          alt=""
                          className="mb-3 h-10 w-10 opacity-60"
                        />
                        <p className="text-sm text-gray-600">
                          No Article found!
                        </p>
                      </div>
                    )}
                  </div>
                </TabPanel>

                <TabPanel value="HUMOR" className="!p-0">
                  <div className="grid grid-cols-1 gap-4">
                    {totalCount ? (
                      boardArticles?.map((boardArticle: BoardArticle) => (
                        <CommunityCard
                          boardArticle={boardArticle}
                          key={boardArticle?._id}
                          likeBoArticleHandler={likeArticleHandler}
                        />
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-white p-10 text-center">
                        <img
                          src="/img/icons/icoAlert.svg"
                          alt=""
                          className="mb-3 h-10 w-10 opacity-60"
                        />
                        <p className="text-sm text-gray-600">
                          No Article found!
                        </p>
                      </div>
                    )}
                  </div>
                </TabPanel>
              </div>
            </div>
          </div>
        </TabContext>

        {totalCount > 0 && (
          <div className="mt-6 flex flex-col items-center justify-center gap-2">
            <Pagination
              count={Math.ceil(totalCount / searchCommunity.limit)}
              page={searchCommunity.page}
              shape="circular"
              color="primary"
              onChange={paginationHandler}
            />
            <p className="text-xs text-gray-500">
              Total {totalCount} article{totalCount > 1 ? "s" : ""} available
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Using DEFAULT_INPUT via parameter default

export default withLayoutBasic(Community);
