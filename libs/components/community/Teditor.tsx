import React, { useMemo, useRef, useState } from "react";
import { BoardArticleCategory } from "../../enums/board-article.enum";
import { Editor } from "@toast-ui/react-editor";
import { getJwtToken } from "../../auth";
import { Messages, REACT_APP_API_URL } from "../../config";
import { useRouter } from "next/router";
import axios from "axios";
import { T } from "../../types/common";
import "@toast-ui/editor/dist/toastui-editor.css";
import { useMutation } from "@apollo/client";
import { CREATE_BOARD_ARTICLE } from "../../../apollo/user/mutation";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../../sweetAlert";
import { Message } from "../../enums/common.enum";

const TuiEditor = () => {
  const editorRef = useRef<Editor>(null),
    token = getJwtToken(),
    router = useRouter();
  const [articleCategory, setArticleCategory] = useState<BoardArticleCategory>(
    BoardArticleCategory.FREE
  );

  /** APOLLO REQUESTS **/
  const [createBoardArticle] = useMutation(CREATE_BOARD_ARTICLE);

  const memoizedValues = useMemo(() => {
    const articleTitle = "",
      articleContent = "",
      articleImage = "";
    return { articleTitle, articleContent, articleImage };
  }, []);

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
      memoizedValues.articleImage = responseImage;
      return `${REACT_APP_API_URL}/${responseImage}`;
    } catch (err) {
      console.log("Error, uploadImage:", err);
    }
  };

  const changeCategoryHandler = (e: any) => {
    setArticleCategory(e.target.value);
  };

  const articleTitleHandler = (e: T) => {
    memoizedValues.articleTitle = e.target.value;
  };

  const handleRegisterButton = async () => {
    try {
      const editor = editorRef.current;
      const articleContent = editor?.getInstance().getHTML() as string;
      memoizedValues.articleContent = articleContent;

      if (
        memoizedValues.articleContent === "" &&
        memoizedValues.articleTitle === ""
      ) {
        throw new Error(Message.INSERT_ALL_INPUTS);
      }

      await createBoardArticle({
        variables: { input: { ...memoizedValues, articleCategory } },
      });
      await sweetTopSuccessAlert("Article created successfully", 700);
      await router.push({
        pathname: "/mypage",
        query: { category: "myArticles" },
      });
    } catch (error) {
      await sweetErrorHandling(new Error(Message.INSERT_ALL_INPUTS)).then();
    }
  };

  const doDisabledCheck = () => {
    if (
      memoizedValues.articleContent === "" ||
      memoizedValues.articleTitle === ""
    ) {
      return true;
    }
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
            onChange={articleTitleHandler as any}
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
              const uploadedImageURL = await uploadImage(image);
              callback(uploadedImageURL);
              return false;
            },
          }}
        />
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={handleRegisterButton}
          disabled={doDisabledCheck()}
          className="inline-flex items-center rounded-md bg-[#ff6b81] px-6 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Publish
        </button>
      </div>
    </div>
  );
};

export default TuiEditor;
