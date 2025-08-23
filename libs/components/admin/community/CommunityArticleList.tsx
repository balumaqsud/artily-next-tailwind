import React from "react";
import Link from "next/link";
import Moment from "react-moment";
import { BoardArticle } from "../../../types/board-article/board-article";
import { REACT_APP_API_URL } from "../../../config";
import { BoardArticleStatus } from "../../../enums/board-article.enum";

interface Data {
  category: string;
  title: string;
  writer: string;
  register: string;
  view: number;
  like: number;
  status: string;
  article_id: string;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "article_id",
    numeric: true,
    disablePadding: false,
    label: "ARTICLE ID",
  },
  {
    id: "title",
    numeric: true,
    disablePadding: false,
    label: "TITLE",
  },
  {
    id: "category",
    numeric: true,
    disablePadding: false,
    label: "CATEGORY",
  },
  {
    id: "writer",
    numeric: true,
    disablePadding: false,
    label: "WRITER",
  },
  {
    id: "view",
    numeric: false,
    disablePadding: false,
    label: "VIEW",
  },
  {
    id: "like",
    numeric: false,
    disablePadding: false,
    label: "LIKE",
  },
  {
    id: "register",
    numeric: true,
    disablePadding: false,
    label: "REGISTER DATE",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "STATUS",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: "asc" | "desc";
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick } = props;

  return (
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          <input
            type="checkbox"
            onChange={onSelectAllClick}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </th>
        {headCells.map((headCell) => (
          <th
            key={headCell.id}
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {headCell.label}
          </th>
        ))}
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          ACTIONS
        </th>
      </tr>
    </thead>
  );
}

interface CommunityArticleListProps {
  articles: BoardArticle[];
  anchorEl: any[];
  menuIconClickHandler: (e: any, index: number) => void;
  menuIconCloseHandler: () => void;
  updateArticleHandler: (updateData: any) => void;
  removeArticleHandler: (id: string) => void;
}

const CommunityArticleList: React.FC<CommunityArticleListProps> = ({
  articles,
  anchorEl,
  menuIconClickHandler,
  menuIconCloseHandler,
  updateArticleHandler,
  removeArticleHandler,
}) => {
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("article_id");
  const [selected, setSelected] = React.useState<readonly string[]>([]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = articles.map((n) => n._id.toString());
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const getStatusColor = (status: string) => {
    switch (status) {
      case BoardArticleStatus.ACTIVE:
        return "bg-green-100 text-green-800";
      case BoardArticleStatus.DELETE:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const safeArticles = articles || [];

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={safeArticles.length}
          />
          <tbody className="bg-white divide-y divide-gray-200">
            {safeArticles.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                  No articles found
                </td>
              </tr>
            )}

            {safeArticles.map((article, index) => {
              const isItemSelected = isSelected(article._id.toString());

              return (
                <tr
                  key={article._id.toString()}
                  className={`hover:bg-gray-50 transition-colors duration-200 ${
                    isItemSelected ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={isItemSelected}
                      onChange={(event) =>
                        handleClick(event as any, article._id.toString())
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {article._id.toString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={`${REACT_APP_API_URL}/${article.articleImage}`}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {article.articleTitle}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {article.articleCategory}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {article.memberId?.toString() || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {article.articleViews || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {article.articleLikes || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <Moment format="YYYY-MM-DD">
                      {article.createdAt || new Date()}
                    </Moment>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        article.articleStatus
                      )}`}
                    >
                      {article.articleStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="relative">
                      <button
                        onClick={(e) => menuIconClickHandler(e, index)}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>

                      {anchorEl[index] && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                          <button
                            onClick={() => {
                              updateArticleHandler({
                                _id: article._id.toString(),
                                articleStatus: BoardArticleStatus.ACTIVE,
                              });
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                          >
                            Activate
                          </button>
                          <button
                            onClick={() => {
                              updateArticleHandler({
                                _id: article._id.toString(),
                                articleStatus: BoardArticleStatus.DELETE,
                              });
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() =>
                              removeArticleHandler(article._id.toString())
                            }
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommunityArticleList;
