import React from "react";
import Link from "next/link";
import { REACT_APP_API_URL } from "../../config";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";

interface AgentCardProps {
  artist: any;
  likeTargetAgentHandler: any;
}

const ArtistCard = (props: AgentCardProps) => {
  const { artist, likeTargetAgentHandler } = props;
  const user = useReactiveVar(userVar);
  const imagePath: string = artist?.memberImage
    ? `${REACT_APP_API_URL}/${artist?.memberImage}`
    : "/img/profile/defaultUser.svg";

  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <Link
        href={{ pathname: "/artist/detail", query: { artistId: artist?._id } }}
        className="block"
      >
        <div
          className="relative h-48 w-full bg-gray-100 sm:h-56"
          style={{
            backgroundImage: `url(${imagePath})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {typeof artist?.memberProducts !== "undefined" && (
            <div className="absolute left-2 top-2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
              {artist?.memberProducts} products
            </div>
          )}
        </div>
      </Link>
      <div className="flex items-center justify-between p-3">
        <div className="min-w-0">
          <Link
            href={{
              pathname: "/artist/detail",
              query: { artistId: artist?._id },
            }}
          >
            <p className="truncate text-sm font-semibold text-gray-900">
              {artist?.memberFullName ?? artist?.memberNick}
            </p>
          </Link>
          <p className="text-xs text-gray-500">Agent</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-gray-600">
            <RemoveRedEyeIcon fontSize="small" />
            <span className="text-xs">{artist?.memberViews}</span>
          </div>
          <button
            aria-label="favorite"
            onClick={() => {
              if (!user?._id) {
                alert("Please login to like artists");
                return;
              }
              likeTargetAgentHandler(user, artist?._id);
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          >
            {artist?.meLiked && artist?.meLiked[0]?.myFavorite ? (
              <FavoriteIcon className="text-red-500" fontSize="small" />
            ) : (
              <FavoriteBorderIcon className="text-gray-500" fontSize="small" />
            )}
          </button>
          <span className="text-xs text-gray-600">{artist?.memberLikes}</span>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
