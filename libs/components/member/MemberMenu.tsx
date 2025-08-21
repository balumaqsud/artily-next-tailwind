import React, { useState } from "react";
import { useRouter } from "next/router";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import Link from "next/link";
import { Member } from "../../types/member/member";
import { REACT_APP_API_URL } from "../../config";
import { GET_MEMBER } from "../../../apollo/user/query";
import { useQuery } from "@apollo/client";
import { T } from "../../types/common";

interface MemberMenuProps {
  subscribeHandler: any;
  unsubscribeHandler: any;
}

const MemberMenu = (props: MemberMenuProps) => {
  const { subscribeHandler, unsubscribeHandler } = props;
  const device = useDeviceDetect();
  const router = useRouter();
  const category: any = router.query?.category;
  const [member, setMember] = useState<Member | null>(null);
  const { memberId } = router.query;

  /** APOLLO REQUESTS **/

  const {
    loading: getMemberLoading,
    data: getMemberData,
    error: getMemberError,
    refetch: getMemberRefetch,
  } = useQuery(GET_MEMBER, {
    fetchPolicy: "network-only",
    variables: { input: memberId },
    skip: !memberId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setMember(data?.getMember);
    },
  });

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      {/* Profile Section */}
      <div className="mb-6">
        <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-4">
          <div className="relative">
            <img
              src={
                member?.memberImage
                  ? `${REACT_APP_API_URL}/${member?.memberImage}`
                  : "/img/profile/defaultUser.svg"
              }
              alt="member-photo"
              className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-white"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
              {member?.memberNick}
            </h3>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-600 mb-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>{member?.memberPhone}</span>
            </div>
            <span className="inline-flex items-center rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-medium text-pink-800">
              {member?.memberType}
            </span>
          </div>
        </div>
      </div>

      {/* Follow Button Section */}
      <div className="mb-6 text-center sm:text-left">
        {member?.meFollowed && member?.meFollowed[0]?.myFollowing ? (
          <div className="space-y-2">
            <button
              onClick={() =>
                unsubscribeHandler(member?._id, getMemberRefetch, memberId)
              }
              className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Unfollow
            </button>
            <p className="text-xs text-gray-500">Following</p>
          </div>
        ) : (
          <button
            onClick={() =>
              subscribeHandler(member?._id, getMemberRefetch, memberId)
            }
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 shadow-sm"
          >
            Follow
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="space-y-6">
        {/* Details Section */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Details</h4>
          <div className="space-y-1">
            {member?.memberType === "AGENT" && (
              <Link
                href={{
                  pathname: "/member",
                  query: { ...router.query, category: "properties" },
                }}
                scroll={false}
                className={`block w-full rounded-lg p-3 transition-all duration-200 ${
                  category === "properties"
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {category === "properties" ? (
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                      )}
                    </div>
                    <span className="font-medium">Properties</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {member?.memberProducts}
                  </span>
                </div>
              </Link>
            )}

            <Link
              href={{
                pathname: "/member",
                query: { ...router.query, category: "followers" },
              }}
              scroll={false}
              className={`block w-full rounded-lg p-3 transition-all duration-200 ${
                category === "followers"
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                  </div>
                  <span className="font-medium">Followers</span>
                </div>
                <span className="text-sm font-semibold">
                  {member?.memberFollowers}
                </span>
              </div>
            </Link>

            <Link
              href={{
                pathname: "/member",
                query: { ...router.query, category: "followings" },
              }}
              scroll={false}
              className={`block w-full rounded-lg p-3 transition-all duration-200 ${
                category === "followings"
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                  </div>
                  <span className="font-medium">Followings</span>
                </div>
                <span className="text-sm font-semibold">
                  {member?.memberFollowings}
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Community Section */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">
            Community
          </h4>
          <div className="space-y-1">
            <Link
              href={{
                pathname: "/member",
                query: { ...router.query, category: "articles" },
              }}
              scroll={false}
              className={`block w-full rounded-lg p-3 transition-all duration-200 ${
                category === "articles"
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {category === "articles" ? (
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <span className="font-medium">Articles</span>
                </div>
                <span className="text-sm font-semibold">
                  {member?.memberArticles}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberMenu;
