import React, { useMemo, useState } from "react";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import { useQuery, gql } from "@apollo/client";

// Placeholder query; replace with real schema
const GET_CART = gql`
  query GetCart($input: OrdinaryInquiry!) {
    getCart(input: $input) {
      totalPrice
      list {
        _id
        productTitle
        productPrice
        productImages
        quantity
        variant
      }
    }
  }
`;

const ProductsCart = () => {
  const { data, loading } = useQuery(GET_CART, {
    fetchPolicy: "network-only",
    variables: { input: { page: 1, limit: 50 } },
  });

  const items = data?.getCart?.list ?? [];
  const [country, setCountry] = useState<string>("South Korea");
  const [shipping, setShipping] = useState<"STANDARD" | "EXPRESS">("STANDARD");

  const subtotal = useMemo(() => {
    if (data?.getCart?.totalPrice) return data.getCart.totalPrice as number;
    return items.reduce(
      (acc: number, it: any) =>
        acc + (it.productPrice ?? 0) * (it.quantity ?? 1),
      0
    );
  }, [items, data]);
  const standardFee = 12.79;
  const expressExtra = 29.13;
  const shippingFee =
    shipping === "STANDARD" ? standardFee : standardFee + expressExtra;
  const total = subtotal + shippingFee;

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        {!loading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="mt-6 text-lg text-gray-600">
              You don’t have any items in your cart.
            </p>
            <a href="/product" className="mt-4 text-[#ff6b81] font-semibold">
              Discover Artly
            </a>
          </div>
        )}

        {items.length > 0 && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-md bg-green-50 p-4 text-green-700">
                All eligible products have been discounted by at least 25%.
              </div>
              {items.map((it: any) => (
                <div
                  key={it._id}
                  className="flex items-center gap-6 border-t pt-6"
                >
                  <img
                    src={it.productImages?.[0] || "/banner/main.jpg"}
                    alt={it.productTitle}
                    className="h-28 w-28 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#1a175a]">
                      {it.productTitle}
                    </h3>
                    <p className="text-gray-600">{it.variant}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <button className="h-10 w-10 rounded-full bg-gray-100 text-xl">
                        -
                      </button>
                      <div className="flex h-10 w-14 items-center justify-center rounded border text-lg">
                        {it.quantity ?? 1}
                      </div>
                      <button className="h-10 w-10 rounded-full bg-gray-100 text-xl">
                        +
                      </button>
                    </div>
                    <div className="min-w-[100px] text-right">
                      <div className="text-xl font-semibold text-[#6b5cff]">
                        ${it.productPrice?.toFixed(2)}
                      </div>
                    </div>
                    <button className="h-10 w-10 rounded-full bg-[#0f0c3f] text-white text-lg">
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="lg:col-span-1">
              <div className="rounded-xl border p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-extrabold text-[#1a175a]">
                    Delivery to{" "}
                    <span className="font-extrabold">{country}</span>
                  </h2>
                  <button className="text-[#ff6b81] font-semibold">
                    Change
                  </button>
                </div>

                <div className="space-y-4">
                  <button
                    className={`w-full rounded-xl border p-4 text-left ${
                      shipping === "STANDARD"
                        ? "border-[#1a175a]"
                        : "border-gray-200"
                    }`}
                    onClick={() => setShipping("STANDARD")}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-extrabold text-[#1a175a]">
                        Standard Shipping
                      </p>
                    </div>
                    <p className="text-gray-600">Between 8 - 10 September</p>
                  </button>

                  <button
                    className={`w-full rounded-xl border p-4 text-left ${
                      shipping === "EXPRESS"
                        ? "border-[#1a175a]"
                        : "border-gray-200"
                    }`}
                    onClick={() => setShipping("EXPRESS")}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-extrabold text-[#1a175a]">
                        Express Shipping
                      </p>
                      <p className="text-[#1a175a] font-extrabold">
                        + ${expressExtra}
                      </p>
                    </div>
                    <p className="text-gray-600">By August 26</p>
                  </button>
                </div>

                <div className="mt-6">
                  <button className="flex w-full items-center justify-between rounded-xl border p-4">
                    <span className="font-semibold text-[#1a175a]">
                      Coupon / Gift Card
                    </span>
                    <span className="text-[#1a175a]">▾</span>
                  </button>
                </div>

                <hr className="my-6" />

                <div className="space-y-3 text-[#1a175a]">
                  <h3 className="text-lg font-extrabold">Order Summary</h3>
                  <div className="flex items-center justify-between">
                    <span>Items</span>
                    <div>
                      <span className="line-through text-gray-400 mr-2">
                        ${subtotal.toFixed(2)}
                      </span>
                      <span className="font-semibold">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Standard shipping</span>
                    <span>${shippingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 text-xl font-extrabold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button className="w-full h-12 rounded-full bg-[#ff6b81] p-2 text-base font-semibold text-white hover:bg-[#ff5a73]">
                    Checkout
                  </button>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default withLayoutBasic(ProductsCart);
