import React, { useEffect, useState } from "react";
import { useRouter, withRouter } from "next/router";
import Link from "next/link";
import { ChatsCircle, Headset, User, UserCircleGear } from "phosphor-react";
import cookies from "js-cookie";

const AdminMenuList = (props: any) => {
  const router = useRouter();
  const [openSubMenu, setOpenSubMenu] = useState("Users");
  const [openMenu, setOpenMenu] = useState(
    typeof window === "object" ? cookies.get("admin_menu") === "true" : false
  );
  const [clickMenu, setClickMenu] = useState<any>([]);
  const [clickSubMenu, setClickSubMenu] = useState("");

  const {
    router: { pathname },
  } = props;

  const pathnames = pathname.split("/").filter((x: any) => x);

  /** LIFECYCLES **/
  useEffect(() => {
    switch (pathnames[1]) {
      case "products":
        setClickMenu(["Products"]);
        break;
      case "community":
        setClickMenu(["Community"]);
        break;
      case "cs":
        setClickMenu(["Cs"]);
        break;
      default:
        setClickMenu(["Users"]);
        break;
    }

    switch (pathnames[2]) {
      case "logs":
        setClickSubMenu("Logs");
        break;
      case "inquiry":
        setClickSubMenu("1:1 Inquiry");
        break;
      case "notice":
        setClickSubMenu("Notice");
        break;
      case "faq":
        setClickSubMenu("FAQ");
        break;
      case "board_create":
        setClickSubMenu("Board Create");
        break;
      default:
        setClickSubMenu("List");
        break;
    }
  }, []);

  /** HANDLERS **/
  const subMenuChangeHandler = (target: string) => {
    if (clickMenu.find((item: string) => item === target)) {
      setClickMenu(clickMenu.filter((menu: string) => target !== menu));
    } else {
      setClickMenu([...clickMenu, target]);
    }
  };

  const menu_set = [
    {
      title: "Users",
      icon: <User size={20} className="text-gray-400" weight="fill" />,
      on_click: () => subMenuChangeHandler("Users"),
    },
    {
      title: "Products",
      icon: (
        <UserCircleGear size={20} className="text-gray-400" weight="fill" />
      ),
      on_click: () => subMenuChangeHandler("Products"),
    },
    {
      title: "Community",
      icon: <ChatsCircle size={20} className="text-gray-400" weight="fill" />,
      on_click: () => subMenuChangeHandler("Community"),
    },
    {
      title: "Cs",
      icon: <Headset size={20} className="text-gray-400" weight="fill" />,
      on_click: () => subMenuChangeHandler("Cs"),
    },
  ];

  const sub_menu_set: any = {
    Users: [{ title: "List", url: "/_admin/users" }],
    Products: [{ title: "List", url: "/_admin/products" }],
    Community: [{ title: "List", url: "/_admin/community" }],
    Cs: [
      { title: "FAQ", url: "/_admin/cs/faq" },
      { title: "Notice", url: "/_admin/cs/notice" },
    ],
  };

  return (
    <div className="w-full">
      {menu_set.map((item, index) => (
        <div key={index} className="w-full">
          <button
            onClick={item.on_click}
            className={`w-full flex items-center justify-between px-6 py-3 text-left transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 ${
              clickMenu[0] === item.title
                ? "bg-blue-50 text-blue-600 border-r-2 border-blue-500"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">{item.icon}</div>
              <span className="font-medium">{item.title}</span>
            </div>
            <div className="flex-shrink-0">
              {clickMenu.find((menu: string) => item.title === menu) ? (
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              )}
            </div>
          </button>

          <div
            className={`transition-all duration-200 ease-in-out ${
              clickMenu.find((menu: string) => item.title === menu)
                ? "max-h-96 opacity-100"
                : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            <div className="pl-12">
              {sub_menu_set[item.title] &&
                sub_menu_set[item.title].map((sub: any, i: number) => (
                  <Link href={sub.url} shallow={true} replace={true} key={i}>
                    <div
                      className={`px-4 py-2 text-sm transition-all duration-200 cursor-pointer rounded-md ${
                        clickMenu[0] === item.title &&
                        clickSubMenu === sub.title
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                      }`}
                    >
                      {sub.title}
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default withRouter(AdminMenuList);
