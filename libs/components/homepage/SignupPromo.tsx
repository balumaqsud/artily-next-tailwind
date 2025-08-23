import * as React from "react";
import Link from "next/link";
import { Button } from "@/libs/components/ui/button";
import { useTranslation } from "next-i18next";

type SignupPromoProps = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  bg?: string; // background image url
};

export default function SignupPromo({
  title,
  subtitle,
  ctaLabel,
  ctaHref = "/account/join",
  bg = "/banner/main7.jpg",
}: SignupPromoProps) {
  const { t } = useTranslation("common");
  
  return (
    <div className=" mt-16 w-full px-4 py-8">
      <div
        className="mx-auto w-full max-w-7xl rounded-2xl bg-cover bg-center px-4 py-12 text-center"
        style={{ backgroundImage: `url('${bg}')` }}
        role="region"
        aria-label="Signup promo"
      >
        <h3 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
          {title || t("Join the community")}
        </h3>
        <p className="mt-2 text-lg font-semibold text-foreground md:text-xl">
          {subtitle || t("Make your first purchase and get 25% off.")}
        </p>
        <Link href={ctaHref} className="mt-5 inline-block">
          <Button className="h-11 rounded-full bg-[#ff6b81] px-6 text-base font-semibold text-white hover:bg-[#ff5a73] cursor-pointer">
            {ctaLabel || t("Sign Up")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
