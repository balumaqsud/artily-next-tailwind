import React from "react";
import Link from "next/link";
import { REACT_APP_API_URL } from "../../config";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";

interface AgentCardProps {
  agent: any;
  likeTargetAgentHandler: any;
}

const AgentCard = (props: AgentCardProps) => {
  const { agent, likeTargetAgentHandler } = props;
  const user = useReactiveVar(userVar);
  const imagePath: string = agent?.memberImage
    ? `${REACT_APP_API_URL}/${agent?.memberImage}`
    : "/img/profile/defaultUser.svg";

  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <Link
        href={{ pathname: "/agent/detail", query: { agentId: agent?._id } }}
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
          {typeof agent?.memberProperties !== "undefined" && (
            <div className="absolute left-2 top-2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
              {agent?.memberProperties} properties
            </div>
          )}
        </div>
      </Link>
      <div className="flex items-center justify-between p-3">
        <div className="min-w-0">
          <Link
            href={{ pathname: "/agent/detail", query: { agentId: agent?._id } }}
          >
            <p className="truncate text-sm font-semibold text-gray-900">
              {agent?.memberFullName ?? agent?.memberNick}
            </p>
          </Link>
          <p className="text-xs text-gray-500">Agent</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-gray-600">
            <RemoveRedEyeIcon fontSize="small" />
            <span className="text-xs">{agent?.memberViews}</span>
          </div>
          <button
            aria-label="favorite"
            onClick={() => likeTargetAgentHandler(user, agent?._id)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          >
            {agent?.meLiked && agent?.meLiked[0]?.myFavorite ? (
              <FavoriteIcon color={"primary"} fontSize="small" />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )}
          </button>
          <span className="text-xs text-gray-600">{agent?.memberLikes}</span>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
