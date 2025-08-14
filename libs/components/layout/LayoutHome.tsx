import React, { useEffect } from "react";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import Head from "next/head";
import Top from "../Top";
import Footer from "../Footer";
import { Stack } from "@mui/material";
import { userVar } from "../../../apollo/store";
import { useReactiveVar } from "@apollo/client";
import { getJwtToken, updateUserInfo } from "../../auth";
import Chat from "../Chat";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import MainBanner from "../common/MainBanner";

const withLayoutMain = (Component: any) => {
  return (props: any) => {
    const device = useDeviceDetect();
    const user = useReactiveVar(userVar);

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
        <Stack className="w-full min-h-screen flex flex-col">
          <Stack className="w-full">
            <Top />
          </Stack>

          <Stack className="w-full hidden md:block">
            <MainBanner />
          </Stack>

          <Stack className="flex-1 w-full">
            <Component {...props} />
          </Stack>

          <div className="hidden md:block">
            <Chat />
          </div>

          <Stack className="w-full mt-auto">
            <Footer />
          </Stack>
        </Stack>
      </>
    );
  };
};

export default withLayoutMain;
