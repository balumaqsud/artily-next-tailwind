import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import { REACT_APP_API_URL } from "../../config";
import { logOut } from "../../auth";
import { sweetConfirmAlert } from "../../sweetAlert";

const MyMenu = () => {
  const router = useRouter();
  const pathname = (router.query.category as string) ?? "myProfile";
  const category: any = router.query?.category ?? "myProfile";
  const user = useReactiveVar(userVar);

  /** HANDLERS **/
  const logoutHandler = async () => {
    try {
      if (await sweetConfirmAlert("Do you want to logout?")) logOut();
    } catch (err: any) {
      console.log("ERROR, logoutHandler:", err.message);
    }
  };

  const navItemClass = (isActive: boolean) =>
    `flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
      isActive ? "bg-gray-900 text-white" : "text-gray-800 hover:bg-gray-50"
    }`;

  return (
    <div className="w-full p-6">
      {/* Profile */}
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-100">
          <img
            src={
              user?.memberImage
                ? `${REACT_APP_API_URL}/${user?.memberImage}`
                : "/img/profile/defaultUser.svg"
            }
            alt="member-photo"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">
            {user?.memberNick}
          </p>
          <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
            <img
              src={"/img/icons/call.svg"}
              alt={"icon"}
              className="h-3.5 w-3.5"
            />
            <span className="truncate">{user?.memberPhone}</span>
          </div>
          {user?.memberType === "ADMIN" ? (
            <a
              href="/_admin/users"
              target={"_blank"}
              className="mt-1 inline-block text-xs font-semibold text-red-500"
            >
              {user?.memberType}
            </a>
          ) : (
            <span className="mt-1 inline-block text-xs font-semibold text-red-500">
              {user?.memberType}
            </span>
          )}
        </div>
      </div>

      {/* Sections */}
      <div className="mt-6 space-y-6">
        {/* Manage Listings */}
        <div>
          <p className="mb-2 text-xs font-semibold tracking-wide text-gray-500">
            MANAGE LISTINGS
          </p>
          <div className="space-y-1">
            {user.memberType === "AGENT" && (
              <>
                <Link
                  href={{
                    pathname: "/mypage",
                    query: { category: "addProperty" },
                  }}
                  scroll={false}
                >
                  <div className={navItemClass(category === "addProperty")}>
                    <img
                      src={
                        category === "addProperty"
                          ? "/img/icons/whiteTab.svg"
                          : "/img/icons/newTab.svg"
                      }
                      alt="icon"
                      className="h-4 w-4"
                    />
                    <span>Add Property</span>
                  </div>
                </Link>

                <Link
                  href={{
                    pathname: "/mypage",
                    query: { category: "myProperties" },
                  }}
                  scroll={false}
                >
                  <div className={navItemClass(category === "myProperties")}>
                    <img
                      src={
                        category === "myProperties"
                          ? "/img/icons/homeWhite.svg"
                          : "/img/icons/home.svg"
                      }
                      alt="icon"
                      className="h-4 w-4"
                    />
                    <span>My Properties</span>
                  </div>
                </Link>
              </>
            )}

            <Link
              href={{ pathname: "/mypage", query: { category: "myFavorites" } }}
              scroll={false}
            >
              <div className={navItemClass(category === "myFavorites")}>
                <img
                  src={
                    category === "myFavorites"
                      ? "/img/icons/likeWhite.svg"
                      : "/img/icons/like.svg"
                  }
                  alt="icon"
                  className="h-4 w-4"
                />
                <span>My Favorites</span>
              </div>
            </Link>

            <Link
              href={{
                pathname: "/mypage",
                query: { category: "recentlyVisited" },
              }}
              scroll={false}
            >
              <div className={navItemClass(category === "recentlyVisited")}>
                <img
                  src={
                    category === "recentlyVisited"
                      ? "/img/icons/searchWhite.svg"
                      : "/img/icons/search.svg"
                  }
                  alt="icon"
                  className="h-4 w-4"
                />
                <span>Recently Visited</span>
              </div>
            </Link>

            <Link
              href={{ pathname: "/mypage", query: { category: "followers" } }}
              scroll={false}
            >
              <div className={navItemClass(category === "followers")}>
                <img
                  className={"h-4 w-4"}
                  src={"/img/icons/users.svg"}
                  alt={"icon"}
                />
                <span>My Followers</span>
              </div>
            </Link>

            <Link
              href={{ pathname: "/mypage", query: { category: "followings" } }}
              scroll={false}
            >
              <div className={navItemClass(category === "followings")}>
                <img
                  className={"h-4 w-4"}
                  src={"/img/icons/users.svg"}
                  alt={"icon"}
                />
                <span>My Followings</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Community */}
        <div>
          <p className="mb-2 text-xs font-semibold tracking-wide text-gray-500">
            Community
          </p>
          <div className="space-y-1">
            <Link
              href={{ pathname: "/mypage", query: { category: "myArticles" } }}
              scroll={false}
            >
              <div className={navItemClass(category === "myArticles")}>
                <img
                  src={
                    category === "myArticles"
                      ? "/img/icons/discoveryWhite.svg"
                      : "/img/icons/discovery.svg"
                  }
                  alt="icon"
                  className="h-4 w-4"
                />
                <span>Articles</span>
              </div>
            </Link>

            <Link
              href={{
                pathname: "/mypage",
                query: { category: "writeArticle" },
              }}
              scroll={false}
            >
              <div className={navItemClass(category === "writeArticle")}>
                <img
                  src={
                    category === "writeArticle"
                      ? "/img/icons/whiteTab.svg"
                      : "/img/icons/newTab.svg"
                  }
                  alt="icon"
                  className="h-4 w-4"
                />
                <span>Write Article</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Manage Account */}
        <div>
          <p className="mb-2 text-xs font-semibold tracking-wide text-gray-500">
            MANAGE ACCOUNT
          </p>
          <div className="space-y-1">
            <Link
              href={{ pathname: "/mypage", query: { category: "myProfile" } }}
              scroll={false}
            >
              <div className={navItemClass(category === "myProfile")}>
                <img
                  src={
                    category === "myProfile"
                      ? "/img/icons/userWhite.svg"
                      : "/img/icons/user.svg"
                  }
                  alt="icon"
                  className="h-4 w-4"
                />
                <span>My Profile</span>
              </div>
            </Link>

            <button onClick={logoutHandler} className={navItemClass(false)}>
              <img
                className={"h-4 w-4"}
                src={"/img/icons/logout.svg"}
                alt={"icon"}
              />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyMenu;
