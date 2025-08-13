import type { AppProps } from "next/app";
import "../styles/globals.css";
import { CssBaseline } from "@mui/material";
import React, { useState } from "react";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../apollo/client";
import { appWithTranslation } from "next-i18next";
const App = ({ Component, pageProps }: AppProps) => {
  const client = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={client}>
      <CssBaseline />
      <Component {...pageProps} />
    </ApolloProvider>
  );
};

export default appWithTranslation(App);
