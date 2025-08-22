import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Pagination, Stack, Typography } from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { useRouter } from "next/router";
import { FollowInquiry } from "../../types/follow/follow.input";
import { useQuery, useReactiveVar } from "@apollo/client";
import { Following } from "../../types/follow/follow";
import { REACT_APP_API_URL } from "../../config";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { userVar } from "../../../apollo/store";
import { GET_MEMBER_FOLLOWINGS } from "../../../apollo/user/query";
import { T } from "../../types/common";

interface MemberFollowingsProps {
  initialInput: FollowInquiry;
  subscribeHandler: any;
  unsubscribeHandler: any;
  redirectToMemberPageHandler: any;
  likeMemberHandler: any;
}

const MemberFollowings = (props: MemberFollowingsProps) => {
  const {
    initialInput,
    subscribeHandler,
    unsubscribeHandler,
    redirectToMemberPageHandler,
    likeMemberHandler,
  } = props;
  const device = useDeviceDetect();
  const router = useRouter();
  const [total, setTotal] = useState<number>(0);
  const category: any = router.query?.category ?? "properties";
  const [followInquiry, setFollowInquiry] =
    useState<FollowInquiry>(initialInput);
  const [memberFollowings, setMemberFollowings] = useState<Following[]>([]);
  const user = useReactiveVar(userVar);

  /** APOLLO REQUESTS **/
  const {
    loading: getMemberFollowingsLoading,
    data: getMemberFollowingsData,
    error: getMemberFollowingsError,
    refetch: getMemberFollowingsRefetch,
  } = useQuery(GET_MEMBER_FOLLOWINGS, {
    fetchPolicy: "network-only",
    variables: {
      input: followInquiry,
    },
    skip: !followInquiry?.search?.followerId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setMemberFollowings(data?.getMemberFollowings?.list);
      setTotal(data?.getMemberFollowings?.metaCounter[0]?.total);
    },
  });
  /** LIFECYCLE **/
  useEffect(() => {
    if (router.query.memberId)
      setFollowInquiry({
        page: followInquiry?.page || 1,
        limit: followInquiry?.limit || 4,
        search: { followerId: router.query.memberId as string },
      });
    else
      setFollowInquiry({
        page: followInquiry?.page || 1,
        limit: followInquiry?.limit || 4,
        search: { followerId: user?._id },
      });
  }, [router]);

  useEffect(() => {
    if (followInquiry?.search?.followerId) {
      getMemberFollowingsRefetch({ input: followInquiry }).then();
    }
  }, [followInquiry]);

  /** HANDLERS **/
  const paginationHandler = (page: number) => {
    setFollowInquiry({ ...followInquiry, page });
  };

  const totalPages = Math.ceil(total / (followInquiry?.limit || 5));

  return (
    <div id="member-followings-page" className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
          {category === "followers" ? "Followers" : "Followings"}
        </h1>
        <p className="text-sm text-gray-500">We are glad to see you again!</p>
      </div>

      {/* Followings List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="hidden sm:grid sm:grid-cols-4 gap-4 p-4 bg-gray-50 border-b border-gray-200">
          <div className="font-semibold text-sm text-gray-900">Name</div>
          <div className="font-semibold text-sm text-gray-900">Details</div>
          <div className="font-semibold text-sm text-gray-900">Likes</div>
          <div className="font-semibold text-sm text-gray-900">Action</div>
        </div>

        {/* Followings */}
        {memberFollowings?.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <img
              src="/img/icons/icoAlert.svg"
              alt=""
              className="mb-3 h-10 w-10 opacity-60"
            />
            <p className="text-sm text-gray-600">No Followings yet!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {memberFollowings.map((follower: Following) => {
              const imagePath: string = follower?.followingData?.memberImage
                ? `${REACT_APP_API_URL}/${follower?.followingData?.memberImage}`
                : "/img/profile/defaultUser.svg";
              return (
                <div
                  className="p-4 hover:bg-gray-50 transition-colors"
                  key={follower._id}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* User Info */}
                    <div
                      className="flex items-center gap-3 flex-1 cursor-pointer"
                      onClick={() =>
                        redirectToMemberPageHandler(
                          follower?.followingData?._id
                        )
                      }
                    >
                      <div className="flex-shrink-0">
                        <img
                          src={imagePath}
                          alt=""
                          className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {follower?.followingData?.memberNick}
                        </h3>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="text-center">
                        <div className="font-medium text-gray-900">
                          {follower?.followingData?.memberFollowers}
                        </div>
                        <div className="text-xs">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-900">
                          {follower?.followingData?.memberFollowings}
                        </div>
                        <div className="text-xs">Following</div>
                      </div>
                    </div>

                    {/* Like Button */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          likeMemberHandler(
                            follower?.followingData?._id,
                            getMemberFollowingsRefetch,
                            followInquiry
                          );
                        }}
                        className="p-1 rounded-full hover:bg-pink-50 transition-colors"
                      >
                        {follower?.meLiked &&
                        follower?.meLiked[0]?.myFavorite ? (
                          <svg
                            className="h-5 w-5 text-pink-500 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-5 w-5 text-gray-400 hover:text-pink-500 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        )}
                      </button>
                      <span className="text-sm font-medium text-gray-900">
                        {follower?.followingData?.memberLikes}
                      </span>
                    </div>

                    {/* Follow/Unfollow Button */}
                    {user?._id !== follower?.followingId && (
                      <div className="flex-shrink-0">
                        {follower.meFollowed &&
                        follower.meFollowed[0]?.myFollowing ? (
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-xs text-gray-500">
                              Following
                            </span>
                            <button
                              onClick={() =>
                                unsubscribeHandler(
                                  follower?.followingData?._id,
                                  getMemberFollowingsRefetch,
                                  followInquiry
                                )
                              }
                              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg hover:opacity-90 transition-opacity"
                            >
                              Unfollow
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              subscribeHandler(
                                follower?.followingData?._id,
                                getMemberFollowingsRefetch,
                                followInquiry
                              )
                            }
                            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg hover:opacity-90 transition-opacity"
                          >
                            Follow
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {memberFollowings?.length > 0 && (
        <div className="mt-6 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => paginationHandler(followInquiry.page - 1)}
              disabled={followInquiry.page <= 1}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => paginationHandler(page)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  page === followInquiry.page
                    ? "bg-[#ff6b81] text-white"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => paginationHandler(followInquiry.page + 1)}
              disabled={followInquiry.page >= totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="text-sm text-gray-500">
            Total {total} following{total > 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  );
};

MemberFollowings.defaultProps = {
  initialInput: {
    page: 1,
    limit: 4,
    search: {
      followerId: "",
      followingId: "",
    },
  },
};

export default MemberFollowings;
