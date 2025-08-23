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
    `flex items-center rounded-md px-3 py-2 text-sm ${
      isActive ? "bg-[#ff6b81] text-white" : "text-gray-800 hover:bg-gray-50"
    }`;

  const countClass = (isActive: boolean) =>
    `ml-auto inline-flex min-w-[1.5rem] items-center justify-center rounded-full px-2 py-0.5 text-xs ${
      isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
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
            <span className="truncate">{user?.memberPhone}</span>
          </div>
          {user?.memberType === "ADMIN" ? (
            <Link
              href="/_admin"
              className="mt-1 inline-block text-xs font-semibold text-red-500 hover:underline cursor-pointer"
            >
              {user?.memberType}
            </Link>
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
            Manage
          </p>
          <div className="space-y-1">
            {(user.memberType === "ARTIST" || user.memberType === "SELLER") && (
              <>
                <Link
                  href={{
                    pathname: "/mypage",
                    query: { category: "addProduct" },
                  }}
                  scroll={false}
                >
                  <div className={navItemClass(category === "addProduct")}>
                    Add Product
                  </div>
                </Link>
                <Link
                  href={{
                    pathname: "/mypage",
                    query: { category: "myProducts" },
                  }}
                  scroll={false}
                >
                  <div className={navItemClass(category === "myProducts")}>
                    <span>My Products</span>
                  </div>
                </Link>
              </>
            )}

            <Link
              href={{ pathname: "/mypage", query: { category: "myFavorites" } }}
              scroll={false}
            >
              <div className={navItemClass(category === "myFavorites")}>
                My Favorites
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
                Recently Visited
              </div>
            </Link>

            <Link
              href={{ pathname: "/mypage", query: { category: "followers" } }}
              scroll={false}
            >
              <div className={navItemClass(category === "followers")}>
                <span>My Followers</span>
              </div>
            </Link>

            <Link
              href={{ pathname: "/mypage", query: { category: "followings" } }}
              scroll={false}
            >
              <div className={navItemClass(category === "followings")}>
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
                <span>Write Article</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Manage Account */}
        <div>
          <p className="mb-2 text-xs font-semibold tracking-wide text-gray-500">
            Account
          </p>
          <div className="space-y-1">
            <Link
              href={{ pathname: "/mypage", query: { category: "myProfile" } }}
              scroll={false}
            >
              <div className={navItemClass(category === "myProfile")}>
                <span>My Profile</span>
              </div>
            </Link>

            <button onClick={logoutHandler} className={navItemClass(false)}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyMenu;
