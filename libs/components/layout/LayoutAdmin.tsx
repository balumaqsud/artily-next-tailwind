import type { ComponentType } from "react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MenuList from "../admin/AdminMenuList";
import { getJwtToken, logOut, updateUserInfo } from "../../auth";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import { REACT_APP_API_URL } from "../../config";
import { MemberType } from "../../enums/member.enum";

const drawerWidth = 280;

const withAdminLayout = (Component: ComponentType) => {
  return (props: object) => {
    const router = useRouter();
    const user = useReactiveVar(userVar);
    const [settingsState, setSettingsStateState] = useState(false);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
      null
    );
    const [openMenu, setOpenMenu] = useState(false);
    const [snackbar, setSnackbar] = useState({
      open: false,
      message: "",
      severity: "success",
    });
    const [title, setTitle] = useState("admin");
    const [loading, setLoading] = useState(true);

    /** LIFECYCLES **/
    useEffect(() => {
      const jwt = getJwtToken();
      if (jwt) updateUserInfo(jwt);
      setLoading(false);
    }, []);

    useEffect(() => {
      if (!loading && user.memberType !== MemberType.ADMIN) {
        router.push("/").then();
      }
    }, [loading, user, router]);

    /** HANDLERS **/
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };

    const logoutHandler = () => {
      logOut();
      router.push("/").then();
    };

    if (!user || user?.memberType !== MemberType.ADMIN) return null;

    return (
      <main
        id="pc-wrap"
        className="admin min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50"
      >
        <div className="flex">
          {/* Top App Bar */}
          <div
            className="fixed top-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md shadow-lg border-b border-blue-200/50"
            style={{
              width: `calc(100% - ${drawerWidth}px)`,
              marginLeft: `${drawerWidth}px`,
            }}
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-600">
                  Admin Panel
                </span>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={handleOpenUserMenu}
                className="flex items-center justify-center w-12 h-12 rounded-xl hover:bg-blue-50 hover:shadow-md transition-all duration-300 group"
              >
                <div className="relative">
                  <img
                    src={
                      user?.memberImage
                        ? `${REACT_APP_API_URL}/${user?.memberImage}`
                        : "/profile/defaultUser.svg"
                    }
                    alt="Profile"
                    className="w-12 h-12 rounded-xl object-cover border-2 border-blue-200 group-hover:border-blue-400 transition-colors duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </button>

              {/* User Menu Dropdown */}
              {anchorElUser && (
                <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-200/50 py-3 z-50 animate-in slide-in-from-top-2 duration-200">
                  <div className="px-6 py-4 border-b border-blue-100/50">
                    <div className="text-lg font-semibold text-gray-900 mb-1">
                      {user?.memberNick}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      {user?.memberPhone}
                    </div>
                  </div>

                  <div className="px-3 py-2">
                    <button
                      onClick={logoutHandler}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-200 flex items-center space-x-3 group"
                    >
                      <svg
                        className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Drawer */}
          <div
            className="fixed left-0 top-0 h-full bg-white/95 backdrop-blur-md shadow-2xl border-r border-blue-200/50 z-40"
            style={{ width: drawerWidth }}
          >
            <div className="flex flex-col h-full">
              {/* Logo Section */}
              <div className="flex flex-col items-start p-8 border-b border-blue-200/50 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Artly Admin
                      </div>
                      <div className="text-xs text-gray-500">
                        Management Console
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div className="w-full p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={
                          user?.memberImage
                            ? `${REACT_APP_API_URL}/${user?.memberImage}`
                            : "/profile/defaultUser.svg"
                        }
                        alt="Profile"
                        className="w-12 h-12 rounded-xl object-cover border-2 border-blue-200"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm">
                        {user?.memberNick}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        {user?.memberPhone}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="flex-1 py-6 px-4">
                <MenuList />
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-blue-200/50">
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-2">Powered by</div>
                  <div className="text-sm font-medium text-blue-600">
                    Artly Platform
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div
            className="flex-1 pt-20 px-10 py-10"
            style={{ marginLeft: drawerWidth }}
          >
            <div className="max-w-7xl mx-auto">
              <Component {...props} />
            </div>
          </div>
        </div>
      </main>
    );
  };
};

export default withAdminLayout;
