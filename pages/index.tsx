import { NextPage } from "next";
import useDeviceDetect from "../libs/hooks/useDeviceDetect";
import withLayoutMain from "../libs/components/layout/LayoutHome";
import CommunityBoards from "../libs/components/homepage/CommunityBoards";
import TopAgents from "../libs/components/homepage/TopAgents";
import TopProperties from "../libs/components/homepage/TopProperties";
import { Stack } from "@mui/material";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ProductRange from "../libs/components/homepage/ProductRange";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const Home: NextPage = () => {
  return (
    <Stack className={"home-page"}>
      <ProductRange />
      <TopProperties />
      <TopAgents />
      <CommunityBoards />
    </Stack>
  );
};

export default withLayoutMain(Home);
