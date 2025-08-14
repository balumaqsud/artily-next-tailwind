import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Top from "../Top";
import Footer from "../Footer";
import { getJwtToken, updateUserInfo } from "../../auth";
import Chat from "../Chat";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";

const withLayoutFull = (Component: any) => {
  return (props: any) => {
    const router = useRouter();
    const user = useReactiveVar(userVar);

    useEffect(() => {
      const jwt = getJwtToken();
      if (jwt) updateUserInfo(jwt);
    }, []);

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
          <main className="mx-auto w-full max-w-7xl px-0 md:px-0">
            <Component {...props} />
          </main>
          <Chat />
          <footer className="mt-10">
            <Footer />
          </footer>
        </div>
      </>
    );
  };
};

export default withLayoutFull;
