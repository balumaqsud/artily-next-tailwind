import Link from "next/link";
import { Button } from "@/libs/components/ui/button";

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
      { label: "Home and Living", href: "/artist/join" },
      { label: "Jewelry", href: "/product/category/jewelry" },
      { label: "Art", href: "/artist/join" },
      { label: "Pet Products", href: "/artist/join" },
      { label: "Vintage", href: "/artists" },
      { label: "Children", href: "/artists" },
      { label: "Accessories", href: "/artists" },
    ],
  },
  {
    title: "More",
    items: [
      { label: "About", href: "/about" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Settings", href: "#" },
    ],
  },
];

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#4E89DF] text-muted-foreground">
      <div className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-5">
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
            <div className="w-full max-w-md">
              <div className="flex h-10 w-full items-center rounded-md border pl-3 pr-2">
                <input
                  type="email"
                  placeholder="email"
                  className="h-full w-full bg-transparent  text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <Button className="h-8 rounded-full bg-[#ff6b81] p-2 text-base font-semibold text-white hover:bg-[#ff5a73] cursor-pointer">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex items-center justify-between border-t border-gray-800 pt-8 text-sm">
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
              href="#"
              aria-label="GitHub"
              className="transition-colors hover:text-foreground"
            >
              GitHub
            </a>
            <a
              href="#"
              aria-label="X"
              className="transition-colors hover:text-foreground"
            >
              Facebook
            </a>
            <a
              href="#"
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
