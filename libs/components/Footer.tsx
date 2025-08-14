import Link from "next/link";
import { Button } from "@/libs/components/ui/button";

const footerCols = [
  {
    title: "Shop",
    items: [
      { label: "Home", href: "#" },
      { label: "Shop", href: "#" },
      { label: "Artists", href: "#" },
      { label: "Shop", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Team", href: "#" },
      { label: "Analytics", href: "#" },
      { label: "Next.js Conf", href: "#" },
      { label: "Previews", href: "#" },
    ],
  },
  {
    title: "More",
    items: [
      { label: "Next.js Commerce", href: "#" },
      { label: "Contact Sales", href: "#" },
      { label: "Community", href: "#" },
      { label: "GitHub", href: "#" },
      { label: "Releases", href: "#" },
      { label: "Telemetry", href: "#" },
      { label: "Governance", href: "#" },
    ],
  },
  {
    title: "About",
    items: [
      { label: "Next.js + Vercel", href: "#" },
      { label: "Open Source Software", href: "#" },
      { label: "GitHub", href: "#" },
      { label: "Bluesky", href: "#" },
      { label: "X", href: "#" },
    ],
  },
  {
    title: "Legal",
    items: [{ label: "Privacy Policy", href: "#" }],
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
