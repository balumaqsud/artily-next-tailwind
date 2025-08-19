import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import Notice from "../../libs/components/cs/Notice";
import Faq from "../../libs/components/cs/Faq";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const CS: NextPage = () => {
  const router = useRouter();

  // Handlers (logic unchanged)
  const changeTabHandler = (tab: string) => {
    router.push(
      {
        pathname: "/connect",
        query: { tab },
      },
      undefined,
      { scroll: false }
    );
  };
  const tab = (router.query.tab as string) ?? "notice";

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Connect center
          </h1>
          <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
            Connect with us, we are here to help you.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => changeTabHandler("notice")}
            className={`inline-flex items-center rounded-md border px-5 py-2 text-sm font-semibold shadow-sm focus:outline-none ${
              tab === "notice"
                ? "border-transparent bg-[#ff6b81] text-white"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Notice
          </button>
          <button
            onClick={() => changeTabHandler("faq")}
            className={`inline-flex items-center rounded-md border px-5 py-2 text-sm font-semibold shadow-sm focus:outline-none ${
              tab === "faq"
                ? "border-transparent bg-[#ff6b81] text-white"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            FAQ
          </button>
        </div>

        {/* Content */}
        <div className="mt-8">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            {tab === "notice" && <Notice />}
            {tab === "faq" && <Faq />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withLayoutBasic(CS);
