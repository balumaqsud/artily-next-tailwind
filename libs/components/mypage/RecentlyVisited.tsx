import React, { useState } from "react";
import { NextPage } from "next";
import PropertyCard from "../product/ProductCard";
import { Property } from "../../types/product/product";
import { T } from "../../types/common";
import { GET_VISITED } from "../../../apollo/user/query";
import { useQuery } from "@apollo/client";

const RecentlyVisited: NextPage = () => {
  const [recentlyVisited, setRecentlyVisited] = useState<Property[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [searchVisited, setSearchVisited] = useState<T>({ page: 1, limit: 6 });

  /** APOLLO REQUESTS **/
  const { loading, data, error, refetch } = useQuery(GET_VISITED, {
    fetchPolicy: "network-only",
    variables: { input: searchVisited },
    onCompleted: (data: T) => {
      setRecentlyVisited(data?.getVisited?.list);
      setTotal(data?.getVisited?.metaCounter[0].total || 0);
    },
  });

  /** HANDLERS **/
  const paginationHandler = (page: number) => {
    setSearchVisited({ ...searchVisited, page });
  };

  const totalPages = Math.ceil(total / searchVisited.limit);

  return (
    <div id="my-favorites-page" className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Recently Visited
        </h1>
        <p className="text-sm text-gray-500">We are glad to see you again!</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recentlyVisited?.length ? (
          recentlyVisited?.map((property: Property) => (
            <PropertyCard
              key={property?._id}
              property={property}
              recentlyVisited={true}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-white p-10 text-center">
            <img
              src="/img/icons/icoAlert.svg"
              alt=""
              className="mb-3 h-10 w-10 opacity-60"
            />
            <p className="text-sm text-gray-600">
              No Recently Visited Products found!
            </p>
          </div>
        )}
      </div>

      {recentlyVisited?.length > 0 && (
        <div className="mt-6 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => paginationHandler(searchVisited.page - 1)}
              disabled={searchVisited.page <= 1}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => paginationHandler(page)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  page === searchVisited.page
                    ? "bg-[#ff6b81] text-white"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => paginationHandler(searchVisited.page + 1)}
              disabled={searchVisited.page >= totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="text-sm text-gray-500">
            Total {total} recently visited product{total > 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentlyVisited;
