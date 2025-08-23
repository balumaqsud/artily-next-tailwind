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
      <main id="pc-wrap" className="admin min-h-screen bg-gray-50">
        <div className="flex">
          {/* Top App Bar */}
          <div
            className="fixed top-0 right-0 z-50 flex items-center justify-end px-6 py-3 bg-white shadow-sm border-b border-gray-200"
            style={{
              width: `calc(100% - ${drawerWidth}px)`,
              marginLeft: `${drawerWidth}px`,
            }}
          >
            <div className="relative">
              <button
                onClick={handleOpenUserMenu}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <img
                  src={
                    user?.memberImage
                      ? `${REACT_APP_API_URL}/${user?.memberImage}`
                      : "/profile/defaultUser.svg"
                  }
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                />
              </button>

              {/* User Menu Dropdown */}
              {anchorElUser && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.memberNick}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user?.memberPhone}
                    </div>
                  </div>
                  <button
                    onClick={logoutHandler}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Drawer */}
          <div
            className="fixed left-0 top-0 h-full bg-white shadow-lg border-r border-gray-200 z-40"
            style={{ width: drawerWidth }}
          >
            <div className="flex flex-col h-full">
              {/* Logo Section */}
              <div className="flex flex-col items-start p-6 border-b border-gray-200">
                <div className="mb-6">
                  <img
                    src="/logo/artly-logo.png"
                    alt="Artly Logo"
                    className="h-8"
                  />
                </div>

                {/* User Info */}
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg w-full">
                  <img
                    src={
                      user?.memberImage
                        ? `${REACT_APP_API_URL}/${user?.memberImage}`
                        : "/profile/defaultUser.svg"
                    }
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {user?.memberNick}
                    </div>
                    <div className="text-gray-500">{user?.memberPhone}</div>
                  </div>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="flex-1 py-4">
                <MenuList />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div
            className="flex-1 pt-16 px-8 py-8"
            style={{ marginLeft: drawerWidth }}
          >
            <Component {...props} />
          </div>
        </div>
      </main>
    );
  };
};

export default withAdminLayout;
