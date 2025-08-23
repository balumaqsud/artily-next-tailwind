import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import withAdminLayout from "../../../libs/components/layout/LayoutAdmin";
import CommunityArticleList from "../../../libs/components/admin/community/CommunityArticleList";
import { AllBoardArticlesInquiry } from "../../../libs/types/board-article/board-article.input";
import { BoardArticle } from "../../../libs/types/board-article/board-article";
import {
  BoardArticleCategory,
  BoardArticleStatus,
} from "../../../libs/enums/board-article.enum";
import {
  sweetConfirmAlert,
  sweetErrorHandling,
} from "../../../libs/sweetAlert";
import { BoardArticleUpdate } from "../../../libs/types/board-article/board-article.update";
import {
  REMOVE_BOARD_ARTICLE_BY_ADMIN,
  UPDATE_BOARD_ARTICLE_BY_ADMIN,
} from "../../../apollo/admin/mutation";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_BOARD_ARTICLES_BY_ADMIN } from "../../../apollo/admin/query";
import { T } from "../../../libs/types/common";
import { Direction } from "../../../libs/enums/common.enum";

const DEFAULT_INPUT: AllBoardArticlesInquiry = {
  page: 1,
  limit: 10,
  sort: "createdAt",
  direction: Direction.DESC,
  search: {},
};

const AdminCommunity: NextPage = () => {
  const [anchorEl, setAnchorEl] = useState<any>([]);
  const [communityInquiry, setCommunityInquiry] =
    useState<AllBoardArticlesInquiry>(DEFAULT_INPUT);
  const [articles, setArticles] = useState<BoardArticle[]>([]);
  const [articleTotal, setArticleTotal] = useState<number>(0);
  const [value, setValue] = useState(
    communityInquiry?.search?.articleStatus
      ? communityInquiry?.search?.articleStatus
      : "ALL"
  );
  const [searchType, setSearchType] = useState("ALL");

  /** APOLLO REQUESTS **/

  const [updateBoardArticleByAdmin] = useMutation(
    UPDATE_BOARD_ARTICLE_BY_ADMIN
  );
  const [removeBoardArticleByAdmin] = useMutation(
    REMOVE_BOARD_ARTICLE_BY_ADMIN
  );

  const {
    loading: getAllBoardArticlesByAdminLoading,
    data: getALlBoardArticlesByAdminData,
    error: getAllBoardArticlesByAdminError,
    refetch: getAllBoardArticlesByAdminRefetch,
  } = useQuery(GET_ALL_BOARD_ARTICLES_BY_ADMIN, {
    fetchPolicy: "network-only",
    variables: { input: communityInquiry },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setArticles(data?.getAllArticlesByAdmin?.list);
      setArticleTotal(data?.getAllArticlesByAdmin.metaCounter[0].total ?? 0);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    getAllBoardArticlesByAdminRefetch({ input: communityInquiry }).then();
  }, [communityInquiry]);

  /** HANDLERS **/
  const changePageHandler = async (event: unknown, newPage: number) => {
    communityInquiry.page = newPage + 1;
    await getAllBoardArticlesByAdminRefetch({ input: communityInquiry });
    setCommunityInquiry({ ...communityInquiry });
  };

  const changeRowsPerPageHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    communityInquiry.limit = parseInt(event.target.value, 10);
    communityInquiry.page = 1;
    await getAllBoardArticlesByAdminRefetch({ input: communityInquiry });
    setCommunityInquiry({ ...communityInquiry });
  };

  const menuIconClickHandler = (e: any, index: number) => {
    const tempAnchor = anchorEl.slice();
    tempAnchor[index] = e.currentTarget;
    setAnchorEl(tempAnchor);
  };

  const menuIconCloseHandler = () => {
    setAnchorEl([]);
  };

  const tabChangeHandler = async (event: any, newValue: string) => {
    setValue(newValue);

    setCommunityInquiry({ ...communityInquiry, page: 1, sort: "createdAt" });

    switch (newValue) {
      case "ACTIVE":
        setCommunityInquiry({
          ...communityInquiry,
          search: { articleStatus: BoardArticleStatus.ACTIVE },
        });
        break;
      case "DELETE":
        setCommunityInquiry({
          ...communityInquiry,
          search: { articleStatus: BoardArticleStatus.DELETE },
        });
        break;
      default:
        setCommunityInquiry({
          ...communityInquiry,
          search: {},
        });
        break;
    }
  };

  const searchTypeHandler = async (newValue: string) => {
    try {
      setSearchType(newValue);

      if (newValue !== "ALL") {
        setCommunityInquiry({
          ...communityInquiry,
          page: 1,
          sort: "createdAt",
          search: {
            ...communityInquiry.search,
            articleCategory: newValue as BoardArticleCategory,
          },
        });
      } else {
        setCommunityInquiry({
          ...communityInquiry,
          search: {
            ...communityInquiry.search,
            articleCategory: undefined,
          },
        });
      }
    } catch (err: any) {
      console.log("searchTypeHandler: ", err.message);
    }
  };

  const updateArticleHandler = async (updateData: BoardArticleUpdate) => {
    try {
      console.log("+updateData: ", updateData);
      await updateBoardArticleByAdmin({ variables: { input: updateData } });
      menuIconCloseHandler();
      await getAllBoardArticlesByAdminRefetch({ input: communityInquiry });
    } catch (err: any) {
      menuIconCloseHandler();
      sweetErrorHandling(err).then();
    }
  };

  const removeArticleHandler = async (id: string) => {
    try {
      console.log("🧹 Attempting to remove article with ID:", id);
      if (await sweetConfirmAlert("are you sure to remove?")) {
        console.log("✅ User confirmed removal, calling mutation...");
        const result = await removeBoardArticleByAdmin({
          variables: { input: id },
        });
        console.log("✅ Remove mutation successful:", result);
      } else {
        console.log("❌ User cancelled removal");
        return;
      }
      await getAllBoardArticlesByAdminRefetch({ input: communityInquiry });
    } catch (err: any) {
      console.error("❌ Error removing article:", err);
      console.error("❌ Error message:", err.message);
      console.error("❌ Error details:", err);
      sweetErrorHandling(err).then();
    }
  };

  console.log("+communityInquiry", communityInquiry);
  console.log("+articles", articles);

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Article Management
        </h1>
        <p className="text-gray-600">Manage community articles and content</p>
      </div>

      {/* Debug Information */}
      {getAllBoardArticlesByAdminError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            GraphQL Error:
          </h3>
          <p className="text-red-700 text-sm mb-2">
            {getAllBoardArticlesByAdminError.message}
          </p>
          {getAllBoardArticlesByAdminError.networkError && (
            <p className="text-red-700 text-sm mb-2">
              Network Error:{" "}
              {getAllBoardArticlesByAdminError.networkError.message}
            </p>
          )}
          {getAllBoardArticlesByAdminError.graphQLErrors?.map((err, index) => (
            <p key={index} className="text-red-700 text-sm">
              GraphQL Error {index + 1}: {err.message}
            </p>
          ))}
        </div>
      )}

      {getAllBoardArticlesByAdminLoading && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-blue-800 font-medium">Loading articles...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 p-1">
            <button
              onClick={(e: any) => tabChangeHandler(e, "ALL")}
              className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                value === "ALL"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              All Articles
            </button>
            <button
              onClick={(e: any) => tabChangeHandler(e, "ACTIVE")}
              className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                value === "ACTIVE"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              Active
            </button>
            <button
              onClick={(e: any) => tabChangeHandler(e, "DELETE")}
              className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                value === "DELETE"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              Deleted
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">
              Category:
            </label>
            <select
              value={searchType}
              onChange={(e) => searchTypeHandler(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
            >
              <option value="ALL">All Categories</option>
              {Object.values(BoardArticleCategory).map((category: string) => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Article List */}
        <div className="p-6">
          <CommunityArticleList
            articles={articles}
            anchorEl={anchorEl}
            menuIconClickHandler={menuIconClickHandler}
            menuIconCloseHandler={menuIconCloseHandler}
            updateArticleHandler={updateArticleHandler}
            removeArticleHandler={removeArticleHandler}
          />
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm text-gray-700">Rows per page:</label>
              <select
                value={communityInquiry?.limit}
                onChange={(e: any) => changeRowsPerPageHandler(e)}
                className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {[10, 20, 40, 60].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={(e: any) =>
                  changePageHandler(
                    e,
                    Math.max(0, (communityInquiry?.page || 1) - 2)
                  )
                }
                disabled={communityInquiry?.page <= 1}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Previous
              </button>

              <span className="text-sm text-gray-700">
                Page {communityInquiry?.page} of{" "}
                {Math.ceil(
                  (articleTotal || 0) / (communityInquiry?.limit || 10)
                )}
              </span>

              <button
                onClick={(e: any) =>
                  changePageHandler(e, communityInquiry?.page || 1)
                }
                disabled={
                  (communityInquiry?.page || 1) >=
                  Math.ceil(
                    (articleTotal || 0) / (communityInquiry?.limit || 10)
                  )
                }
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAdminLayout(AdminCommunity);
