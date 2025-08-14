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
import LanguageIcon from "@mui/icons-material/Language";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../apollo/store";
import { Logout } from "@mui/icons-material";
import { REACT_APP_API_URL } from "../config";
import { Button } from "@/libs/components/ui/button";

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
    <Stack className="sticky top-0 z-50 w-full flex flex-row " direction="row">
      <Stack
        className={`fixed top-0 left-0 right-0 z-50 ${
          colorChange || bgColor
            ? "bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm"
            : "bg-transparent"
        } w-full transition-colors duration-300 py-2 `}
      >
        <Stack
          className=" mx-auto flex w-full h-14 max-w-7xl items-center px-3 sm:px-6 justify-between"
          direction="row"
        >
          <Box
            component={"div"}
            className="flex-shrink-0"
            sx={{ display: "flex" }}
          >
            <Link href={"/"}>
              <img
                src="/logo/artly-logo.png"
                alt="artly-logo"
                className="ml-1 h-10 w-auto sm:h-18 md:h-14 lg:h-16"
              />
            </Link>
          </Box>
          <Box
            component={"div"}
            className="router-box pointer-events-auto absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:flex flex-row items-center gap-6"
          >
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
            <Link href={"/artists"}>
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
          </Box>
          <Box
            component={"div"}
            className="ml-auto flex items-center gap-2 sm:gap-2"
            sx={{ display: "flex", flexDirection: "row" }}
          >
            {user?._id ? (
              <>
                <div
                  className="h-8 w-8 cursor-pointer overflow-hidden rounded-full ring-1 ring-gray-200"
                  onClick={(event: any) => setLogoutAnchor(event.currentTarget)}
                >
                  <img
                    src={
                      user?.memberImage
                        ? `${REACT_APP_API_URL}/${user?.memberImage}`
                        : ""
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
                <div className="hidden sm:block"></div>
                <Link href={"/account/join"}>
                  <div>
                    <Button className="rounded-full bg-white px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-gray-900 hover:bg-gray-100 cursor-pointer">
                      {t("Become a seller")}
                    </Button>
                  </div>
                </Link>
                <Link href={"/account/join"}>
                  <div>
                    <Button className="rounded-full bg-white px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-gray-900 hover:bg-gray-100 cursor-pointer">
                      {t("Login")}
                    </Button>
                  </div>
                </Link>
              </>
            )}

            <div className="flex items-center gap-2 rounded-full">
              {user?._id && (
                <NotificationsOutlinedIcon className="h-6 w-6 cursor-pointer text-gray-600 hover:text-gray-800 rounded-full" />
              )}
              <Button
                variant="ghost"
                className="btn-lang flex items-center rounded-full px-2 py-1 hover:bg-gray-100 cursor-pointer"
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
            </div>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default withRouter(Top);
