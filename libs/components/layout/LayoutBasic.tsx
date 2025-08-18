import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import Head from "next/head";
import Top from "../Top";
import Footer from "../Footer";
import { Stack } from "@mui/material";
import { getJwtToken, updateUserInfo } from "../../auth";
import Chat from "../Chat";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import { useTranslation } from "next-i18next";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const withLayoutBasic = (Component: any) => {
  return (props: any) => {
    const router = useRouter();
    const { t, i18n } = useTranslation("common");
    const device = useDeviceDetect();
    const [authHeader, setAuthHeader] = useState<boolean>(false);
    const user = useReactiveVar(userVar);

    const memoizedValues = useMemo(() => {
      let title = "",
        desc = "",
        bgImage = "";

      switch (router.pathname) {
        case "/product":
          title = "Explore our Products";
          desc = "Discover a variety of art products and artworks";
          bgImage = "/pageBanners/shop.jpeg";
          break;
        case "/artist":
          title = "Artists";
          desc = "Find the artist for your art";
          bgImage = "/pageBanners/artist.jpeg";
          break;
        case "/artist/detail":
          title = "Artist Page";
          desc = "See more art from the artist";
          bgImage = "/pageBanners/artist.jpeg";
          break;
        case "/mypage":
          title = "my page";
          desc = "Happy to see you again!";
          bgImage = "/banner/artistic.jpeg";
          break;
        case "/community":
          title = "Together We Create";
          desc = "Create a community of artists";
          bgImage = "/pageBanners/community.jpeg";
          break;
        case "/community/detail":
          title = "Together We Create";
          desc = "Create a community of artists";
          bgImage = "/pageBanners/community.jpeg";
          break;
        case "/connect":
          title = "Connect";
          desc = "Connect to the community";
          bgImage = "/pageBanners/connect.jpeg";
          break;
        case "/account/join":
          title = "Login/Signup";
          desc = "Become a member of Artly";
          bgImage = "/pageBanners/join.jpeg";
          setAuthHeader(true);
          break;
        case "/member":
          title = "Member P";
          desc = "Manage your account and preferences";
          bgImage = "/banner/artistic.jpeg";
          break;
        default:
          break;
      }

      return { title, desc, bgImage };
    }, [router.pathname]);

    /** LIFECYCLES **/
    useEffect(() => {
      const jwt = getJwtToken();
      if (jwt) updateUserInfo(jwt);
    }, []);

    /** HANDLERS **/

    return (
      <>
        <Head>
          <title>Artly</title>
          <meta name={"title"} content={`Artly`} />
        </Head>
        <div className="min-h-screen w-full bg-white text-gray-900">
          <header className="sticky top-0 z-40">
            <Top />
          </header>

          <div className="w-full px-4 mt-19">
            <div
              className={`relative h-64 md:h-80 w-full rounded-[10px] bg-cover bg-center transition-all duration-1000 ease-in-out ${
                authHeader ? "auth" : ""
              }`}
              style={{
                backgroundImage: `url(${memoizedValues.bgImage})`,
              }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight drop-shadow-lg">
                  {t(memoizedValues.title)}
                </h1>
                <p className="mt-4 sm:mt-6 max-w-xs sm:max-w-lg md:max-w-2xl text-white text-sm sm:text-base md:text-lg drop-shadow-md">
                  {t(memoizedValues.desc)}
                </p>
              </div>
            </div>
          </div>

          <main className="mx-auto w-full max-w-7xl px-4">
            <Component {...props} />
          </main>

          <div className="hidden md:block">
            <Chat />
          </div>

          <footer className="mt-10">
            <Footer />
          </footer>
        </div>
      </>
    );
  };
};

export default withLayoutBasic;
