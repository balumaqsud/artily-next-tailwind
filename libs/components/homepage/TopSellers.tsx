import React, { useState } from "react";
import { useRouter } from "next/router";
import { ScrollArea, ScrollBar } from "@/libs/components/ui/scroll-area";
import TopAgentCard from "./TopSellerCard";
import { Member } from "../../types/member/member";
import { SellersInquiry } from "../../types/member/member.input";
import { GET_ARTISTS } from "../../../apollo/user/query";
import { useQuery } from "@apollo/client";
import { T } from "../../types/common";
import { Direction } from "../../enums/common.enum";
import { useTranslation } from "next-i18next";

interface TopSellersProps {
  initialInput?: SellersInquiry;
}

const DEFAULT_INPUT: SellersInquiry = {
  page: 1,
  limit: 10,
  sort: "memberRank",
  direction: Direction.DESC,
  search: {},
};

const TopSellers = ({ initialInput = DEFAULT_INPUT }: TopSellersProps) => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [topSellers, setTopSellers] = useState<Member[]>([]);

  /** APOLLO REQUESTS **/
  const {
    loading: getSellersLoading,
    data: getSellersData,
    error: getSellersError,
    refetch: getSellersRefetch,
  } = useQuery(GET_ARTISTS, {
    fetchPolicy: "cache-and-network",
    variables: { input: initialInput },
    notifyOnNetworkStatusChange: false,
    onCompleted: (data: T) => {
      setTopSellers(data?.getSellers?.list);
    },
  });

  const mockSellers = [
    {
      _id: "s1",
      memberNick: "ArtistMike",
      memberType: "ARTIST",
      memberImage: "img/profile/defaultUser.svg",
      memberRank: 4.9,
    },
    {
      _id: "s2",
      memberNick: "DesignGuru",
      memberType: "ARTIST",
      memberImage: "img/profile/defaultUser.svg",
      memberRank: 4.8,
    },
    {
      _id: "s3",
      memberNick: "CreativeQueen",
      memberType: "ARTIST",
      memberImage: "img/profile/defaultUser.svg",
      memberRank: 4.7,
    },
    {
      _id: "s4",
      memberNick: "VectorVibe",
      memberType: "ARTIST",
      memberImage: "img/profile/defaultUser.svg",
      memberRank: 4.6,
    },
    {
      _id: "s5",
      memberNick: "PixelPro",
      memberType: "ARTIST",
      memberImage: "img/profile/defaultUser.svg",
      memberRank: 4.5,
    },
  ];
  const sellers = topSellers.length > 0 ? topSellers : mockSellers;
  /** HANDLERS **/

  if (!topSellers) return null;

  return (
    <section className="w-full px-4 py-8 pl-4">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-muted-foreground">
              {t("Top artists")}
            </h2>
          </div>
          <div>
            <button
              onClick={() => router.push("/artist")}
              className="text-sm text-foreground hover:underline cursor-pointer"
            >
              {t("See all artists")}
            </button>
          </div>
        </div>

        <ScrollArea className="w-full overflow-hidden">
          <div className="flex w-max gap-4 p-4">
            {sellers.map((seller: any) => (
              <div key={seller?._id} className="shrink-0">
                <TopAgentCard seller={seller} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
};

export default TopSellers;
