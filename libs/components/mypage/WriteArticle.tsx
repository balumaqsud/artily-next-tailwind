import React from "react";
import { NextPage } from "next";
import dynamic from "next/dynamic";
const TuiEditor = dynamic(() => import("../community/Teditor"), { ssr: false });

const WriteArticle: NextPage = () => {
  return (
    <div id="write-article-page" className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Write an Article
        </h1>
        <p className="text-sm text-gray-500">
          Share your ideas with the Artly community.
        </p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
        <TuiEditor />
      </div>
    </div>
  );
};

export default WriteArticle;
