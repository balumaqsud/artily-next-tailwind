import React, { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import { useRouter, withRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { getJwtToken, logOut, updateUserInfo } from "../auth";
import { Stack, Box } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { alpha, styled } from "@mui/material/styles";
import Menu, { MenuProps } from "@mui/material/Menu";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { CaretDown } from "phosphor-react";
import useDeviceDetect from "../hooks/useDeviceDetect";
import Link from "next/link";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import { useReactiveVar, useLazyQuery } from "@apollo/client";
import { userVar } from "../../apollo/store";
import { Logout } from "@mui/icons-material";
import { REACT_APP_API_URL } from "../config";
import { Button } from "@/libs/components/ui/button";

// Placeholder notification query; replace with real query when available
import { gql } from "@apollo/client";
const GET_NOTIFICATIONS = gql`
  query GetNotifications($input: OrdinaryInquiry!) {
    getNotifications(input: $input) {
      list {
        _id
        message
        createdAt
        read
      }
    }
  }
`;

const Top = () => {
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const [lang, setLang] = useState<string | null>("en");
  const drop = Boolean(anchorEl2);
  const [colorChange, setColorChange] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<any | HTMLElement>(null);
  let open = Boolean(anchorEl);
  const [bgColor, setBgColor] = useState<boolean>(false);
  const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(
    null
  );
  const logoutOpen = Boolean(logoutAnchor);
  const [notificationAnchor, setNotificationAnchor] =
    React.useState<null | HTMLElement>(null);
  const notificationOpen = Boolean(notificationAnchor);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loadNotifications, { data: notificationsData }] = useLazyQuery(
    GET_NOTIFICATIONS,
    {
      fetchPolicy: "network-only",
      variables: { input: { page: 1, limit: 10 } },
    }
  );

  /** LIFECYCLES **/
  useEffect(() => {
    if (localStorage.getItem("locale") === null) {
      localStorage.setItem("locale", "en");
      setLang("en");
    } else {
      setLang(localStorage.getItem("locale"));
    }
  }, [router]);

  useEffect(() => {
    switch (router.pathname) {
      case "/product/detail":
        setBgColor(true);
        break;
      default:
        break;
    }
  }, [router]);

  useEffect(() => {
    const jwt = getJwtToken();
    if (jwt) updateUserInfo(jwt);
  }, []);

  /** HANDLERS **/
  const langClick = (e: any) => {
    setAnchorEl2(e.currentTarget);
  };

  const langClose = () => {
    setAnchorEl2(null);
  };

  const langChoice = useCallback(
    async (e: any) => {
      setLang(e.target.id);
      localStorage.setItem("locale", e.target.id);
      setAnchorEl2(null);
      await router.push(router.asPath, router.asPath, { locale: e.target.id });
    },
    [router]
  );

  const changeNavbarColor = () => {
    if (window.scrollY >= 50) {
      setColorChange(true);
    } else {
      setColorChange(false);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleHover = (event: any) => {
    if (anchorEl !== event.currentTarget) {
      setAnchorEl(event.currentTarget);
    } else {
      setAnchorEl(null);
    }
  };

  const StyledMenu = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      {...props}
    />
  ))(({ theme }) => ({
    "& .MuiPaper-root": {
      top: "109px",
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 160,
      color:
        theme.palette.mode === "light"
          ? "rgb(55, 65, 81)"
          : theme.palette.grey[300],
      boxShadow:
        "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
      "& .MuiMenu-list": {
        padding: "4px 0",
      },
      "& .MuiMenuItem-root": {
        "& .MuiSvgIcon-root": {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        "&:active": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  }));

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", changeNavbarColor);
  }
  return (
    <div className="sticky top-0 z-50 w-full">
      <div
        className={`fixed top-0 left-0 right-0 z-50 ${
          colorChange || bgColor
            ? "bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/93 shadow-sm"
            : "bg-transparent"
        } w-full transition-colors duration-300 py-2`}
      >
        <div className="mx-auto flex w-full h-14 max-w-7xl items-center px-3 sm:px-6 justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={"/"}>
              <img
                src="/logo/artly-logo.png"
                alt="artly-logo"
                className="h-10 w-auto sm:h-12 md:h-14"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex-row items-center gap-6">
            <Link href={"/"}>
              <div className="text-base md:text-lg font-medium text-muted-foreground transition-colors hover:text-foreground">
                {t("Home")}
              </div>
            </Link>
            <Link href={"/product"}>
              <div className="text-base md:text-lg font-medium text-muted-foreground transition-colors hover:text-foreground">
                {t("Products")}
              </div>
            </Link>
            <Link href={"/artist"}>
              <div className="text-base md:text-lg font-medium text-muted-foreground transition-colors hover:text-foreground">
                {t("Artists")}
              </div>
            </Link>
            <Link href={"/community?articleCategory=FREE"}>
              <div className="text-base md:text-lg font-medium text-muted-foreground transition-colors hover:text-foreground">
                {t("Community")}
              </div>
            </Link>
            {user?._id && (
              <Link href={"/mypage"}>
                <div className="text-base md:text-lg font-medium text-muted-foreground transition-colors hover:text-foreground">
                  {t("My Page")}
                </div>
              </Link>
            )}
            <Link href={"/connect"}>
              <div className="text-base md:text-lg font-medium text-muted-foreground transition-colors hover:text-foreground">
                {t("Connect")}
              </div>
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* User Actions */}
            {user?._id ? (
              <>
                {/* Cart - Show on all screen sizes */}
                <Link href={"/cart"}>
                  <ShoppingCartOutlinedIcon className="h-6 w-6 cursor-pointer text-gray-600 hover:text-gray-800 transition-colors" />
                </Link>

                {/* Notifications - Show on all screen sizes */}
                <div className="relative">
                  <NotificationsOutlinedIcon
                    className="h-6 w-6 cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
                    onClick={(event: any) => {
                      setNotificationAnchor(event.currentTarget);
                      loadNotifications();
                    }}
                  />
                  <Menu
                    id="notification-menu"
                    anchorEl={notificationAnchor}
                    open={notificationOpen}
                    onClose={() => {
                      setNotificationAnchor(null);
                    }}
                    sx={{ mt: "5px" }}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                  >
                    {notificationsData?.getNotifications?.list?.length ? (
                      notificationsData.getNotifications.list.map((n: any) => (
                        <MenuItem key={n._id}>
                          <div className="px-4 py-2">
                            <p className="text-sm font-medium">{n.message}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(n.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem>
                        <div className="px-4 py-2">
                          <p className="text-sm font-medium">
                            No new notifications
                          </p>
                        </div>
                      </MenuItem>
                    )}
                  </Menu>
                </div>

                {/* User Profile - Show on all screen sizes */}
                <div
                  className="h-8 w-8 cursor-pointer overflow-hidden rounded-full ring-1 ring-gray-200"
                  onClick={(event: any) => setLogoutAnchor(event.currentTarget)}
                >
                  <img
                    src={
                      user?.memberImage
                        ? `${REACT_APP_API_URL}/${user?.memberImage}`
                        : "/profile/defaultUser.svg"
                    }
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>

                <Menu
                  id="basic-menu"
                  anchorEl={logoutAnchor}
                  open={logoutOpen}
                  onClose={() => {
                    setLogoutAnchor(null);
                  }}
                  sx={{ mt: "5px" }}
                >
                  <MenuItem onClick={() => logOut()}>
                    <Logout className="px-4 text-lg font-semibold hover:bg-gray-100 cursor-pointer" />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                {/* Auth Buttons - Show on tablet and up */}
                <div className="hidden sm:flex items-center gap-2">
                  <Link href={"/account/join"}>
                    <Button className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
                      {t("Become a seller")}
                    </Button>
                  </Link>
                  <Link href={"/account/join"}>
                    <Button className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
                      {t("Login")}
                    </Button>
                  </Link>
                </div>
              </>
            )}

            {/* Language Selector - Show on all screen sizes */}
            <Button
              variant="link"
              className="btn-lang flex items-center rounded-full p-0 cursor-pointer"
              onClick={langClick}
              aria-label="language"
            >
              <LanguageIcon fontSize="medium" className="text-gray-600" />
            </Button>

            <StyledMenu
              anchorEl={anchorEl2}
              open={drop}
              onClose={langClose}
              sx={{ position: "absolute" }}
            >
              <MenuItem disableRipple onClick={langChoice} id="en">
                {t("English")} (EN)
              </MenuItem>
              <MenuItem disableRipple onClick={langChoice} id="kr">
                {t("Korean")} (KR)
              </MenuItem>
            </StyledMenu>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="fixed top-14 left-0 right-0 bg-white shadow-lg border-t border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-6 space-y-4">
                {/* Mobile Navigation Links */}
                <div className="space-y-2">
                  <Link href={"/"} onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex items-center px-3 py-2 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                      {t("Home")}
                    </div>
                  </Link>
                  <Link
                    href={"/product"}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center px-3 py-2 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                      {t("Products")}
                    </div>
                  </Link>
                  <Link
                    href={"/artist"}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center px-3 py-2 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                      {t("Artists")}
                    </div>
                  </Link>
                  <Link
                    href={"/community?articleCategory=FREE"}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center px-3 py-2 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                      {t("Community")}
                    </div>
                  </Link>
                  {user?._id && (
                    <Link
                      href={"/mypage"}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="flex items-center px-3 py-2 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                        {t("My Page")}
                      </div>
                    </Link>
                  )}
                  <Link
                    href={"/connect"}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center px-3 py-2 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                      {t("Connect")}
                    </div>
                  </Link>
                </div>

                {/* Mobile Auth Buttons (if not logged in) */}
                {!user?._id && (
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <Link
                      href={"/account/join"}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button className="w-full rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-3 text-sm font-semibold text-white hover:from-pink-600 hover:to-purple-600 transition-all">
                        {t("Become a seller")}
                      </Button>
                    </Link>
                    <Link
                      href={"/account/join"}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                        {t("Login")}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default withRouter(Top);
