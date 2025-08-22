import React, { useMemo, useRef, useState } from "react";
import { BoardArticleCategory } from "../../enums/board-article.enum";
import { Editor } from "@toast-ui/react-editor";
import { getJwtToken } from "../../auth";
import { Messages, REACT_APP_API_URL } from "../../config";
import { useRouter } from "next/router";
import axios from "axios";
import { T } from "../../types/common";
import "@toast-ui/editor/dist/toastui-editor.css";
import { useMutation, useReactiveVar } from "@apollo/client";
import { CREATE_BOARD_ARTICLE } from "../../../apollo/user/mutation";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../../sweetAlert";
import { Message } from "../../enums/common.enum";
import { userVar } from "../../../apollo/store";
import { ArticleInput } from "../../types/board-article/board-article.input";

const TuiEditor = () => {
  const editorRef = useRef<Editor>(null);
  const token = getJwtToken();
  const router = useRouter();
  const user = useReactiveVar(userVar);

  const [articleCategory, setArticleCategory] = useState<BoardArticleCategory>(
    BoardArticleCategory.FREE
  );
  const [articleTitle, setArticleTitle] = useState<string>("");
  const [articleImage, setArticleImage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  /** APOLLO REQUESTS **/
  const [createBoardArticle] = useMutation(CREATE_BOARD_ARTICLE);

  /** HANDLERS **/
  const uploadImage = async (image: any) => {
    try {
      const formData = new FormData();
      formData.append(
        "operations",
        JSON.stringify({
          query: `mutation ImageUploader($file: Upload!, $target: String!) {\n            imageUploader(file: $file, target: $target) \n          }`,
          variables: { file: null, target: "article" },
        })
      );
      formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
      formData.append("0", image);

      const response = await axios.post(
        `${REACT_APP_API_URL}/graphql`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "apollo-require-preflight": true,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseImage = response.data.data.imageUploader;
      setArticleImage(responseImage);
      return `${REACT_APP_API_URL}/${responseImage}`;
    } catch (err) {
      console.log("Error, uploadImage:", err);
      throw new Error("Failed to upload image");
    }
  };

  const changeCategoryHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setArticleCategory(e.target.value as BoardArticleCategory);
  };

  const articleTitleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArticleTitle(e.target.value);
  };

  const handleRegisterButton = async () => {
    try {
      if (!user?._id) {
        throw new Error("User not authenticated");
      }

      setIsSubmitting(true);

      const editor = editorRef.current;
      if (!editor) {
        throw new Error("Editor not initialized");
      }

      const articleContent = editor.getInstance().getHTML() as string;

      // Validate inputs
      if (!articleTitle.trim()) {
        throw new Error("Article title is required");
      }

      if (
        !articleContent.trim() ||
        articleContent === "<p><br></p>" ||
        articleContent === "<p></p>"
      ) {
        throw new Error("Article content is required");
      }

      if (!articleCategory) {
        throw new Error("Article category is required");
      }

      const articleData: ArticleInput = {
        articleCategory,
        articleTitle: articleTitle.trim(),
        articleContent: articleContent.trim(),
        articleImage: articleImage || "",
      };

      console.log("Creating article with data:", articleData);

      await createBoardArticle({
        variables: { input: articleData },
      });

      await sweetTopSuccessAlert("Article created successfully", 700);

      // Reset form
      setArticleTitle("");
      setArticleImage("");
      if (editorRef.current) {
        editorRef.current.getInstance().setHTML("");
      }

      // Redirect to my articles
      await router.push({
        pathname: "/mypage",
        query: { category: "myArticles" },
      });
    } catch (error: any) {
      console.error("Error creating article:", error);
      const errorMessage = error.message || "Failed to create article";
      await sweetErrorHandling(new Error(errorMessage)).then();
    } finally {
      setIsSubmitting(false);
    }
  };

  const doDisabledCheck = () => {
    return !articleTitle.trim() || isSubmitting || !user?._id;
  };

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-gray-700">Category</label>
          <select
            value={articleCategory}
            onChange={changeCategoryHandler}
            className="mt-1 h-9 w-full rounded-lg border-2 border-gray-100 bg-gradient-to-r from-white to-gray-50 px-4 py-3 text-sm font-medium text-gray-800 shadow-sm transition-all duration-200 hover:border-gray-200 hover:shadow-md focus:border-[#ff6b81] focus:outline-none focus:ring-2 focus:ring-[#ff6b81]/20 focus:shadow-lg"
          >
            <option value={BoardArticleCategory.FREE} className="py-2">
              Free Discussion
            </option>
            <option value={BoardArticleCategory.NEW} className="py-2">
              Latest News
            </option>
            <option value={BoardArticleCategory.RECOMMEND} className="py-2">
              Recommendations
            </option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700">Title</label>
          <input
            value={articleTitle}
            onChange={articleTitleHandler}
            placeholder="Type title"
            className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
      </div>

      {/* Editor */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <Editor
          initialValue={"Type here"}
          placeholder={"Type here"}
          previewStyle={"vertical"}
          height={"640px"}
          // @ts-ignore
          initialEditType={"WYSIWYG"}
          toolbarItems={[
            ["heading", "bold", "italic", "strike"],
            ["image", "table", "link"],
            ["ul", "ol", "task"],
          ]}
          ref={editorRef}
          hooks={{
            addImageBlobHook: async (image: any, callback: any) => {
              try {
                const uploadedImageURL = await uploadImage(image);
                callback(uploadedImageURL);
                return false;
              } catch (error) {
                console.error("Image upload failed:", error);
                return false;
              }
            },
          }}
        />
      </div>

      {/* Validation Messages */}
      {!user?._id && (
        <div className="mt-4 text-center text-sm text-red-600">
          Please log in to create articles
        </div>
      )}

      <div className="mt-4 flex justify-center">
        <button
          onClick={handleRegisterButton}
          disabled={doDisabledCheck()}
          className="inline-flex items-center rounded-md bg-[#ff6b81] px-6 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 transition-all duration-200"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Publishing...
            </>
          ) : (
            "Publish Article"
          )}
        </button>
      </div>
    </div>
  );
};

export default TuiEditor;
