import React, { useState } from "react";
import { Comment } from "../../types/comment/comment";
import { REACT_APP_API_URL } from "../../config";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";

interface ReviewCardProps {
  comment: Comment;
  onUpdateComment?: (commentId: string, newContent: string) => void;
  onRemoveComment?: (commentId: string) => void;
}

const ReviewCard = ({
  comment,
  onUpdateComment,
  onRemoveComment,
}: ReviewCardProps) => {
  const user = useReactiveVar(userVar);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.commentContent);
  const [isUpdating, setIsUpdating] = useState(false);

  const imagePath: string = comment?.memberData?.memberImage
    ? `${REACT_APP_API_URL}/${comment?.memberData?.memberImage}`
    : "/profile/defaultUser.svg";

  const isOwnComment = user?._id === comment.memberId;

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(comment.commentContent);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent(comment.commentContent);
  };

  const handleUpdate = async () => {
    if (!editContent.trim() || editContent === comment.commentContent) {
      handleCancel();
      return;
    }

    setIsUpdating(true);
    try {
      if (onUpdateComment) {
        await onUpdateComment(comment._id, editContent);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (window.confirm("Are you sure you want to remove this review?")) {
      try {
        if (onRemoveComment) {
          await onRemoveComment(comment._id);
        }
      } catch (error) {
        console.error("Error removing comment:", error);
      }
    }
  };

  return (
    <div className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={imagePath}
              alt={comment.memberData?.memberNick}
              className="h-10 w-10 rounded-full object-cover border-2 border-gray-100"
            />
            <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border border-white"></div>
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              {comment.memberData?.memberNick}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isOwnComment && !isEditing && (
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <svg
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </button>
            <button
              onClick={handleRemove}
              className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200 transition-colors cursor-pointer"
            >
              <svg
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-none"
            rows={3}
            placeholder="Update your review..."
          />
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleCancel}
              disabled={isUpdating}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={
                isUpdating ||
                !editContent.trim() ||
                editContent === comment.commentContent
              }
              className="inline-flex items-center rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white hover:from-pink-600 hover:to-purple-600 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Updating...
                </>
              ) : (
                "Update Review"
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {comment.commentContent}
          </p>
        </div>
      )}

      {/* Updated indicator */}
      {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
        <div className="mt-3 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1">
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Edited {new Date(comment.updatedAt).toLocaleDateString()}
          </span>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
