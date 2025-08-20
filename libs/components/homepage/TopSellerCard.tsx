import React from "react";
import { useRouter } from "next/router";
import { Member } from "../../types/member/member";
import { REACT_APP_API_URL } from "../../config";

interface TopSellerProps {
  seller: Member;
}

const TopSellerCard = ({ seller }: TopSellerProps) => {
  const router = useRouter();

  const avatar = seller?.memberImage
    ? `${REACT_APP_API_URL}/${seller?.memberImage}`
    : "/img/profile/defaultUser.svg";
  const banner = "/banner/main.jpg"; // placeholder artwork backdrop

  return (
    <div className="w-[300px] rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-1000 ease-in-out hover:scale-105 hover:shadow-md  dark:border-neutral-100 dark:bg-neutral-100">
      <div
        className="relative aspect-[4/3] w-full bg-cover bg-center rounded-t-2xl"
        style={{ backgroundImage: `url('${banner}')` }}
      />

      <div className="p-4">
        <div className="relative -mt-10 mb-2 flex w-full justify-center">
          <img
            src={avatar}
            alt={seller?.memberNick || "seller"}
            className="h-16 w-16 rounded-full border-1 border-white object-cover shadow-md dark:border-neutral-200"
          />
        </div>
        <h3 className="text-center text-lg font-semibold text-foreground">
          {seller?.memberNick}
        </h3>
        <p className="mt-1 text-center text-xs text-muted-foreground">
          {seller?.memberType}
        </p>
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => router.push(`/artist/detail?artistId=${seller._id}`)}
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow hover:bg-gray-100 cursor-pointer"
          >
            View Artist
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopSellerCard;
