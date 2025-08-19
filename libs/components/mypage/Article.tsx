import React from "react";

const Article = () => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="relative h-40 w-full bg-gray-100">
        <img
          src="/collections/art.jpeg"
          alt="cover"
          className="h-full w-full object-cover"
        />
        <div className="absolute left-3 top-3 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
          July 28
        </div>
      </div>
      <div className="p-3">
        <div className="text-sm font-semibold text-gray-900">
          Artly Collection
        </div>
        <div className="mt-1 text-xs text-gray-500">Artly makes it easy</div>
      </div>
    </div>
  );
};

export default Article;
