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
        case "/property":
          title = "Property Search";
          desc = "We are glad to see you again!";
          bgImage = "/img/banner/properties.png";
          break;
        case "/agent":
          title = "Agents";
          desc = "Home / For Rent";
          bgImage = "/img/banner/agents.webp";
          break;
        case "/agent/detail":
          title = "Agent Page";
          desc = "Home / For Rent";
          bgImage = "/img/banner/header2.svg";
          break;
        case "/mypage":
          title = "my page";
          desc = "Home / For Rent";
          bgImage = "/img/banner/header1.svg";
          break;
        case "/community":
          title = "Community";
          desc = "Home / For Rent";
          bgImage = "/img/banner/header2.svg";
          break;
        case "/community/detail":
          title = "Community Detail";
          desc = "Home / For Rent";
          bgImage = "/img/banner/header2.svg";
          break;
        case "/cs":
          title = "CS";
          desc = "We are glad to see you again!";
          bgImage = "/img/banner/header2.svg";
          break;
        case "/account/join":
          title = "Login/Signup";
          desc = "Authentication Process";
          bgImage = "/img/banner/header2.svg";
          setAuthHeader(true);
          break;
        case "/member":
          title = "Member Page";
          desc = "Home / For Rent";
          bgImage = "/img/banner/header1.svg";
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
        <div className="min-h-screen w-full bg-background text-foreground">
          <header className="sticky top-0 z-40">
            <Top />
          </header>

          <div
            className={`relative h-64 md:h-80 w-full bg-cover bg-center ${
              authHeader ? "auth" : ""
            }`}
            style={{
              backgroundImage: `url(${memoizedValues.bgImage})`,
              boxShadow: "inset 10px 40px 150px 40px rgb(24 22 36)",
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
              <h1 className="text-white text-2xl md:text-4xl font-bold tracking-tight drop-shadow-lg">
                {t(memoizedValues.title)}
              </h1>
              <p className="mt-2 text-white text-sm md:text-base drop-shadow-md">
                {t(memoizedValues.desc)}
              </p>
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
