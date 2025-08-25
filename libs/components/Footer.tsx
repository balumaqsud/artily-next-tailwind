import Link from "next/link";
import { Button } from "@/libs/components/ui/button";
import { useState } from "react";
import { sweetTopSmallSuccessAlert } from "../sweetAlert";

const footerCols = [
  {
    title: "Artly",
    items: [
      { label: "Home", href: "/" },
      { label: "Shop", href: "/product" },
      { label: "Artists", href: "/artist" },
      { label: "Community", href: "/community" },
      { label: "Connect", href: "/Connect" },
    ],
  },
  {
    title: "Collections",
    items: [
      {
        label: "Home and Living",
        href: `/product?input=${JSON.stringify({
          page: 1,
          limit: 9,
          sort: "createdAt",
          direction: "DESC",
          search: { typeList: ["HOME_LIVING"] },
        })}`,
      },
      {
        label: "Jewelry",
        href: `/product?input=${JSON.stringify({
          page: 1,
          limit: 9,
          sort: "createdAt",
          direction: "DESC",
          search: { typeList: ["JEWELRY"] },
        })}`,
      },
      {
        label: "Art",
        href: `/product?input=${JSON.stringify({
          page: 1,
          limit: 9,
          sort: "createdAt",
          direction: "DESC",
          search: { typeList: ["ART_COLLECTABLES"] },
        })}`,
      },
      {
        label: "Pet Products",
        href: `/product?input=${JSON.stringify({
          page: 1,
          limit: 9,
          sort: "createdAt",
          direction: "DESC",
          search: { typeList: ["PET_PRODUCTS"] },
        })}`,
      },
      {
        label: "Vintage",
        href: `/product?input=${JSON.stringify({
          page: 1,
          limit: 9,
          sort: "createdAt",
          direction: "DESC",
          search: { typeList: ["VINTAGE"] },
        })}`,
      },
      {
        label: "Children",
        href: `/product?input=${JSON.stringify({
          page: 1,
          limit: 9,
          sort: "createdAt",
          direction: "DESC",
          search: { typeList: ["CHILDREN"] },
        })}`,
      },
      {
        label: "Accessories",
        href: `/product?input=${JSON.stringify({
          page: 1,
          limit: 9,
          sort: "createdAt",
          direction: "DESC",
          search: { typeList: ["ACCESSORY"] },
        })}`,
      },
    ],
  },
  {
    title: "More",
    items: [
      { label: "About", href: "/about" },
      { label: "Profile", href: "/mypage" },
    ],
  },
];

const Footer = () => {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return;
    }

    setIsSubscribing(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success alert
      await sweetTopSmallSuccessAlert(
        `Thank you! ${email} has been subscribed to our newsletter.`,
        3000
      );

      // Clear the email input
      setEmail("");
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-[#4E89DF] text-muted-foreground">
      <div className="mx-auto w-full max-w-7xl px-12 pt-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {footerCols.map((col) => (
            <div key={col.title} className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Subscribe column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Subscribe to our newsletter
            </h3>
            <p className="max-w-md text-sm">
              Stay updated on new releases and features, guides, and case
              studies.
            </p>
            <form onSubmit={handleSubscribe} className="w-full max-w-md">
              <div className="flex h-10 w-full items-center rounded-md border pl-3 pr-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-full w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  required
                />
                <Button
                  type="submit"
                  disabled={isSubscribing || !email.trim()}
                  className="h-8 rounded-full bg-[#ff6b81] p-2 text-base font-semibold text-white hover:bg-[#ff5a73] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isSubscribing ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
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
                      Subscribing...
                    </div>
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-gray-800 pt-2 text-sm">
          <span>© {year} Artly, Inc.</span>
          <div className="flex-shrink-0">
            <img
              src="/logo/artly-logo.png"
              alt="logo"
              className="h-20 w-auto"
            />
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://www.facebook.com/artly.co.kr"
              aria-label="X"
              className="transition-colors hover:text-foreground"
            >
              Facebook
            </a>
            <a
              href="https://www.instagram.com/artly.co.kr"
              aria-label="Butterfly"
              className="transition-colors hover:text-foreground"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
