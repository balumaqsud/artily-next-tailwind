import React, { useState } from "react";
import type { NextPage } from "next";
import withAdminLayout from "../../../libs/components/layout/LayoutAdmin";
import NoticeList from "../../../libs/components/admin/cs/NoticeList";

const NoticeArticles: NextPage = (props: any) => {
  const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
  const [value, setValue] = useState("ALL");
  const [searchType, setSearchType] = useState("ALL");

  /** APOLLO REQUESTS **/
  /** LIFECYCLES **/
  /** HANDLERS **/

  const tabChangeHandler = async (event: any, newValue: string) => {
    setValue(newValue);
    // Add tab change logic here
  };

  const searchTypeHandler = async (newValue: string) => {
    setSearchType(newValue);
    // Add search type logic here
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Notice Management
        </h1>
        <p className="text-gray-600">
          Manage site announcements and important notices
        </p>
      </div>

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
              All Notices
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
              onClick={(e: any) => tabChangeHandler(e, "IMPORTANT")}
              className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                value === "IMPORTANT"
                  ? "bg-orange-50 text-orange-700 border border-orange-200"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              Important
            </button>
            <button
              onClick={(e: any) => tabChangeHandler(e, "DELETED")}
              className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                value === "DELETED"
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
              <option value="GENERAL">General</option>
              <option value="IMPORTANT">Important</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="UPDATE">Update</option>
              <option value="EVENT">Event</option>
            </select>
          </div>
        </div>

        {/* Notice List */}
        <div className="p-6">
          <NoticeList
            notices={[]}
            anchorEl={anchorEl}
            menuIconClickHandler={() => {}}
            menuIconCloseHandler={() => {}}
            updateNoticeHandler={() => {}}
            removeNoticeHandler={() => {}}
          />
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm text-gray-700">Rows per page:</label>
              <select
                defaultValue={10}
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
                disabled
                className="px-3 py-1 text-sm text-gray-400 cursor-not-allowed transition-colors duration-200"
              >
                Previous
              </button>

              <span className="text-sm text-gray-700">Page 1 of 1</span>

              <button
                disabled
                className="px-3 py-1 text-sm text-gray-400 cursor-not-allowed transition-colors duration-200"
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

export default withAdminLayout(NoticeArticles);
