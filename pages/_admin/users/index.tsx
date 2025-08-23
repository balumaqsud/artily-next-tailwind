import React, { useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";
import withAdminLayout from "../../../libs/components/layout/LayoutAdmin";
import MemberPanelList from "../../../libs/components/admin/users/MemberList";
import { MembersInquiry } from "../../../libs/types/member/member.input";
import { Member } from "../../../libs/types/member/member";
import { MemberStatus, MemberType } from "../../../libs/enums/member.enum";
import { sweetErrorHandling } from "../../../libs/sweetAlert";
import { MemberUpdate } from "../../../libs/types/member/member.update";
import { GET_ALL_MEMBERS_BY_ADMIN } from "../../../apollo/admin/query";
import { useMutation, useQuery } from "@apollo/client";
import { T } from "../../../libs/types/common";
import { UPDATE_MEMBER_BY_ADMIN } from "../../../apollo/admin/mutation";
import { Direction } from "../../../libs/enums/common.enum";

const DEFAULT_INPUT: MembersInquiry = {
  page: 1,
  limit: 10,
  sort: "createdAt",
  direction: Direction.DESC,
  search: {},
};

const AdminUsers: NextPage = ({
  initialInput = DEFAULT_INPUT,
  ...props
}: any) => {
  const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
  const [membersInquiry, setMembersInquiry] =
    useState<MembersInquiry>(initialInput);
  const [members, setMembers] = useState<Member[]>([]);
  const [membersTotal, setMembersTotal] = useState<number>(0);
  const [value, setValue] = useState(
    membersInquiry?.search?.memberStatus
      ? membersInquiry?.search?.memberStatus
      : "ALL"
  );
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState("ALL");

  /** APOLLO REQUESTS **/
  const [updateMemberByAdmin] = useMutation(UPDATE_MEMBER_BY_ADMIN);

  const {
    loading: getAllMembersByAdminLoading,
    data: getAllMembersByAdminData,
    error: getAllMembersByAdminError,
    refetch: getAllMembersByAdminRefetch,
  } = useQuery(GET_ALL_MEMBERS_BY_ADMIN, {
    fetchPolicy: "network-only",
    variables: { input: membersInquiry },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setMembers(data?.getAllMembersByAdmin?.list);
      setMembersTotal(data?.getAllMembersByAdmin.metaCounter[0].total);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    getAllMembersByAdminRefetch({ input: membersInquiry }).then();
  }, [membersInquiry]);

  /** HANDLERS **/
  const changePageHandler = async (event: unknown, newPage: number) => {
    membersInquiry.page = newPage + 1;
    await getAllMembersByAdminRefetch({ input: membersInquiry });
    setMembersInquiry({ ...membersInquiry });
  };

  const changeRowsPerPageHandler = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    membersInquiry.limit = parseInt(event.target.value, 10);
    membersInquiry.page = 1;
    await getAllMembersByAdminRefetch({ input: membersInquiry });
    setMembersInquiry({ ...membersInquiry });
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
    setSearchText("");

    setMembersInquiry({ ...membersInquiry, page: 1, sort: "createdAt" });

    switch (newValue) {
      case "ACTIVE":
        setMembersInquiry({
          ...membersInquiry,
          search: { memberStatus: MemberStatus.ACTIVE },
        });
        break;
      case "BLOCK":
        setMembersInquiry({
          ...membersInquiry,
          search: { memberStatus: MemberStatus.BLOCK },
        });
        break;
      case "DELETE":
        setMembersInquiry({
          ...membersInquiry,
          search: { memberStatus: MemberStatus.DELETE },
        });
        break;
      default:
        delete membersInquiry?.search?.memberStatus;
        setMembersInquiry({ ...membersInquiry });
        break;
    }
  };

  const updateMemberHandler = async (updateData: MemberUpdate) => {
    try {
      await updateMemberByAdmin({ variables: { input: updateData } });
      menuIconCloseHandler();
      await getAllMembersByAdminRefetch({ input: membersInquiry });
    } catch (err: any) {
      sweetErrorHandling(err).then();
    }
  };

  const textHandler = useCallback((value: string) => {
    try {
      setSearchText(value);
    } catch (err: any) {
      console.log("textHandler: ", err.message);
    }
  }, []);

  const searchTextHandler = () => {
    try {
      setMembersInquiry({
        ...membersInquiry,
        search: {
          ...membersInquiry.search,
          text: searchText,
        },
      });
    } catch (err: any) {
      console.log("searchTextHandler: ", err.message);
    }
  };

  const searchTypeHandler = async (newValue: string) => {
    try {
      setSearchType(newValue);

      if (newValue !== "ALL") {
        setMembersInquiry({
          ...membersInquiry,
          page: 1,
          sort: "createdAt",
          search: {
            ...membersInquiry.search,
            memberType: newValue as MemberType,
          },
        });
      } else {
        delete membersInquiry?.search?.memberType;
        setMembersInquiry({ ...membersInquiry });
      }
    } catch (err: any) {
      console.log("searchTypeHandler: ", err.message);
    }
  };

  const removeMemberHandler = async (id: string) => {
    try {
      console.log("removeMemberHandler: ", id);
    } catch (err: any) {
      console.log("removeMemberHandler: ", err.message);
    }
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Member Management
        </h1>
        <p className="text-gray-600">Manage user accounts and permissions</p>
      </div>

      {/* Debug Information */}
      {getAllMembersByAdminError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            GraphQL Error:
          </h3>
          <p className="text-red-700 text-sm mb-2">
            {getAllMembersByAdminError.message}
          </p>
          {getAllMembersByAdminError.networkError && (
            <p className="text-red-700 text-sm mb-2">
              Network Error: {getAllMembersByAdminError.networkError.message}
            </p>
          )}
          {getAllMembersByAdminError.graphQLErrors?.map((err, index) => (
            <p key={index} className="text-red-700 text-sm">
              GraphQL Error {index + 1}: {err.message}
            </p>
          ))}
        </div>
      )}

      {getAllMembersByAdminLoading && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-blue-800 font-medium">Loading members...</p>
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
              All Members
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
              onClick={(e: any) => tabChangeHandler(e, "BLOCK")}
              className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                value === "BLOCK"
                  ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              Blocked
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
          <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => textHandler(e.target.value)}
                  placeholder="Search user name"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") searchTextHandler();
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
                {searchText && (
                  <button
                    onClick={async () => {
                      setSearchText("");
                      setMembersInquiry({
                        ...membersInquiry,
                        search: {
                          ...membersInquiry.search,
                          text: "",
                        },
                      });
                      await getAllMembersByAdminRefetch({
                        input: membersInquiry,
                      });
                    }}
                    className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => searchTextHandler()}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Member Type Filter */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Type:</label>
              <select
                value={searchType}
                onChange={(e) => searchTypeHandler(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
              >
                <option value="ALL">All Types</option>
                <option value="USER">User</option>
                <option value="AGENT">Agent</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Member List */}
        <div className="p-6">
          <MemberPanelList
            members={members}
            anchorEl={anchorEl}
            menuIconClickHandler={menuIconClickHandler}
            menuIconCloseHandler={menuIconCloseHandler}
            updateMemberHandler={updateMemberHandler}
            removeMemberHandler={removeMemberHandler}
          />
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm text-gray-700">Rows per page:</label>
              <select
                value={membersInquiry?.limit}
                onChange={changeRowsPerPageHandler}
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
                    Math.max(0, (membersInquiry?.page || 1) - 2)
                  )
                }
                disabled={membersInquiry?.page <= 1}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Previous
              </button>

              <span className="text-sm text-gray-700">
                Page {membersInquiry?.page} of{" "}
                {Math.ceil((membersTotal || 0) / (membersInquiry?.limit || 10))}
              </span>

              <button
                onClick={(e: any) =>
                  changePageHandler(e, membersInquiry?.page || 1)
                }
                disabled={
                  (membersInquiry?.page || 1) >=
                  Math.ceil((membersTotal || 0) / (membersInquiry?.limit || 10))
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

export default withAdminLayout(AdminUsers);
