import React from "react";
import { NextPage } from "next";
import withLayoutFull from "../../libs/components/layout/LayoutFull";

const About: NextPage = () => {
  return (
    <div className="w-full mt-20 px-10">
      {/* Intro */}
      <section className="mx-auto w-full max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
              We’re on a mission to celebrate creativity
            </h1>
            <p className="mt-4 text-sm leading-6 text-gray-600 md:text-base">
              Artly connects independent makers with people who love beautiful
              things. From handmade jewelry to limited-run prints, we help
              creators share their products with the world — and help shoppers
              discover items that feel personal, meaningful, and unique.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff6b81]/10">
                  <img
                    src="/img/icons/securePayment.svg"
                    alt="icon"
                    className="h-4 w-4"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Secure payments
                  </p>
                  <p className="text-xs text-gray-600">
                    Encrypted checkout. Sellers never see your card.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff6b81]/10">
                  <img
                    src="/img/icons/keywording.svg"
                    alt="icon"
                    className="h-4 w-4"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Made by artists
                  </p>
                  <p className="text-xs text-gray-600">
                    Support independent creators around the globe.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff6b81]/10">
                  <img
                    src="/img/icons/investment.svg"
                    alt="icon"
                    className="h-4 w-4"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Fair marketplace
                  </p>
                  <p className="text-xs text-gray-600">
                    Transparent pricing and direct-to-creator value.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff6b81]/10">
                  <img
                    src="/img/icons/garden.svg"
                    alt="icon"
                    className="h-4 w-4"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Thoughtful curation
                  </p>
                  <p className="text-xs text-gray-600">
                    Find products that feel personal and well-made.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative hidden h-64 w-full overflow-hidden rounded-xl bg-gray-100 md:block">
            <img
              src="/logo/artly-logo.png"
              alt="about banner"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-6">
        <div className="grid grid-cols-3 gap-4 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <div>
            <p className="text-2xl font-extrabold text-gray-900">4M</p>
            <p className="text-xs text-gray-600">Items shipped</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900">12K</p>
            <p className="text-xs text-gray-600">Independent sellers</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900">20M</p>
            <p className="text-xs text-gray-600">Happy customers</p>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="mx-auto w-full max-w-7xl px-4 py-8">
        <p className="text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
          Trusted by creators and shoppers worldwide
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-6 opacity-80">
          <img src="/img/icons/brands/amazon.svg" alt="brand" className="h-6" />
          <img src="/img/icons/brands/amd.svg" alt="brand" className="h-6" />
          <img src="/img/icons/brands/cisco.svg" alt="brand" className="h-6" />
          <img
            src="/img/icons/brands/dropcam.svg"
            alt="brand"
            className="h-6"
          />
          <img
            src="/img/icons/brands/spotify.svg"
            alt="brand"
            className="h-6"
          />
        </div>
      </section>

      {/* Help CTA */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-12">
        <div className="grid grid-cols-1 items-center gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Need help? Talk to our team.
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Chat with us or browse frequently asked questions.
            </p>
          </div>
          <div className="flex items-center justify-end gap-3">
            <button className="inline-flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50">
              Contact Us
            </button>
            <button className="inline-flex items-center rounded-md bg-[#ff6b81] px-4 py-2 text-sm font-semibold text-white hover:opacity-95">
              +1 (555) 555-0199
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default withLayoutFull(About);
