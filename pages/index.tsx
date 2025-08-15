import { NextPage } from "next";
import useDeviceDetect from "../libs/hooks/useDeviceDetect";
import withLayoutMain from "../libs/components/layout/LayoutHome";
import CommunityBoards from "../libs/components/homepage/CommunityBoards";
import { Stack } from "@mui/material";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ProductRange from "../libs/components/homepage/ProductRange";
import TopProducts from "../libs/components/homepage/TopProducts";
import ValueProps from "../libs/components/homepage/ValueProps";
import SignupPromo from "../libs/components/homepage/SignupPromo";
import PopularProducts from "../libs/components/homepage/PopularProducts";
import TopSellers from "../libs/components/homepage/TopSellers";
import TrendingProducts from "../libs/components/homepage/TrendingProducts";
import ShopHero from "../libs/components/homepage/ShopHero";
import ShopHero2 from "../libs/components/homepage/ShopHero2";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const Home: NextPage = () => {
  return (
    <Stack className={"home-page"}>
      <ProductRange />
      <TopProducts />
      <ShopHero2 />
      <ValueProps />
      <TrendingProducts />
      <PopularProducts />
      <TopSellers />
      <ShopHero />
      <CommunityBoards />
      <SignupPromo />
    </Stack>
  );
};

export default withLayoutMain(Home);
