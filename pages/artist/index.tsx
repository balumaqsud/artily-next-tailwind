import React, { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { NextPage } from "next";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import { Pagination } from "@mui/material";
import ArtistCard from "../../libs/components/common/ArtistCard";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Member } from "../../libs/types/member/member";
import { LIKE_TARGET_MEMBER } from "../../apollo/user/mutation";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ARTISTS } from "../../apollo/user/query";
import { T } from "../../libs/types/common";
import {
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "../../libs/sweetAlert";
import { Direction } from "../../libs/enums/common.enum";
import { Messages } from "../../libs/config";
import { SellersInquiry } from "../../libs/types/member/member.input";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const DEFAULT_INPUT: SellersInquiry = {
  page: 1,
  limit: 10,
  sort: "createdAt",
  direction: Direction.DESC,
  search: {},
};

const ArtistList: NextPage = ({
  initialInput = DEFAULT_INPUT,
  ...props
}: any) => {
  const router = useRouter();
  const [filterSortName, setFilterSortName] = useState("Recent");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState<SellersInquiry>(
    router?.query?.input
      ? JSON.parse(router?.query?.input as string)
      : initialInput
  );
  const [artists, setArtists] = useState<Member[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>("");

  /** APOLLO REQUESTS **/
  const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

  const {
    loading: getArtistsLoading,
    data: getArtistsData,
    error: getArtistsError,
    refetch: getArtistsRefetch,
  } = useQuery(GET_ARTISTS, {
    fetchPolicy: "network-only",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setArtists(data?.getSellers?.list);
      setTotal(data?.getSellers?.metaCounter[0]?.total);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    if (router.query.input) {
      const input_obj = JSON.parse(router?.query?.input as string);
      setSearchFilter(input_obj);
    } else
      router.replace(
        `/artist?input=${JSON.stringify(searchFilter)}`,
        `/artist?input=${JSON.stringify(searchFilter)}`
      );

    setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
  }, [router]);

  /** HANDLERS **/
  const likeTargetAgentHandler = async (user: T, id: string) => {
    try {
      if (!id) return;

      if (!user._id) throw new Error(Messages.error2);

      //important
      await likeTargetMember({ variables: { input: id } });

      //refetch
      await getArtistsRefetch({ input: searchFilter });
      await sweetTopSmallSuccessAlert("success", 800);
    } catch (error: any) {
      console.log("liketargetArtist", error);
      if (
        error.message.includes("401") ||
        error.message.includes("Unauthorized")
      ) {
        sweetMixinErrorAlert("Please login to like artists").then();
      } else {
        sweetMixinErrorAlert(error.message).then();
      }
    }
  };

  const sortingHandler = (key: "recent" | "old" | "likes" | "views") => {
    switch (key) {
      case "recent":
        setSearchFilter({
          ...searchFilter,
          sort: "createdAt",
          direction: Direction.DESC,
        });
        setFilterSortName("Recent");
        break;
      case "old":
        setSearchFilter({
          ...searchFilter,
          sort: "createdAt",
          direction: Direction.ASC,
        });
        setFilterSortName("Oldest order");
        break;
      case "likes":
        setSearchFilter({
          ...searchFilter,
          sort: "memberLikes",
          direction: Direction.DESC,
        });
        setFilterSortName("Likes");
        break;
      case "views":
        setSearchFilter({
          ...searchFilter,
          sort: "memberViews",
          direction: Direction.DESC,
        });
        setFilterSortName("Views");
        break;
    }
    setMenuOpen(false);
  };

  const searchHandler = () => {
    setSearchFilter({
      ...searchFilter,
      page: 1,
      search: {
        ...searchFilter.search,
        text: searchText.trim() || undefined,
      },
    });
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      searchHandler();
    }
  };

  const paginationChangeHandler = async (
    event: ChangeEvent<unknown>,
    value: number
  ) => {
    searchFilter.page = value;
    await router.push(
      `/artist?input=${JSON.stringify(searchFilter)}`,
      `/artist?input=${JSON.stringify(searchFilter)}`,
      {
        scroll: false,
      }
    );
    setCurrentPage(value);
  };

  return (
    <div className="w-full bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Filter Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              placeholder="Search artists..."
              className="w-94 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
            />
            <button
              onClick={searchHandler}
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded-md bg-pink-500 text-white hover:bg-pink-600 transition-colors"
            >
              <svg
                className="h-4 w-4"
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

          {/* Sort Filter */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-foreground hover:bg-gray-50 cursor-pointer"
            >
              Sort by: {filterSortName}
              <span className="ml-1">▾</span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 z-20 mt-2 w-40 rounded-md border border-gray-200 bg-white p-1 shadow">
                <button
                  onClick={() => sortingHandler("recent")}
                  className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100 cursor-pointer"
                >
                  Recent
                </button>
                <button
                  onClick={() => sortingHandler("old")}
                  className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100 cursor-pointer"
                >
                  Oldest
                </button>
                <button
                  onClick={() => sortingHandler("likes")}
                  className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100 cursor-pointer"
                >
                  Likes
                </button>
                <button
                  onClick={() => sortingHandler("views")}
                  className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-gray-100 cursor-pointer"
                >
                  Views
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {artists?.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-white p-10 text-center">
              <img
                src="/img/icons/icoAlert.svg"
                alt=""
                className="mb-3 h-10 w-10 opacity-60"
              />
              <p className="text-sm text-gray-600">No artists found!</p>
            </div>
          ) : (
            artists.map((artist: Member) => (
              <ArtistCard
                likeTargetAgentHandler={likeTargetAgentHandler}
                artist={artist}
                key={artist._id}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex flex-col items-center justify-center gap-2">
          {artists.length !== 0 &&
            Math.ceil(total / searchFilter.limit) > 1 && (
              <Pagination
                page={currentPage}
                count={Math.ceil(total / searchFilter.limit)}
                onChange={paginationChangeHandler}
                shape="circular"
                color="primary"
              />
            )}
          {artists.length !== 0 && (
            <span className="text-xs text-[color:var(--muted-foreground)]">
              Total {total} artist{total > 1 ? "s" : ""} available
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// No defaultProps; using DEFAULT_INPUT via parameter default instead

export default withLayoutBasic(ArtistList);
