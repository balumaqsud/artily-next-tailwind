import React from "react";

const Notice = () => {
  const data = [
    {
      no: 1,
      event: true,
      title: "Register to use and get discounts",
      date: "01.03.2024",
    },
    {
      no: 2,
      title: "It's absolutely free to upload and trade properties",
      date: "31.03.2024",
    },
  ];

  return (
    <div className="w-full">
      <div className="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {data.map((ele: any) => (
          <div
            key={ele.title}
            className="flex items-center justify-between px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 text-center text-xs text-gray-500">
                {ele.event ? "-" : ele.no}
              </span>
              <span className="text-sm font-medium text-gray-900">
                {ele.title}
              </span>
            </div>
            <span className="text-sm text-gray-500">{ele.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notice;
