import React, { useMemo, useState, useEffect } from "react";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import { useQuery, useMutation, useReactiveVar } from "@apollo/client";
import { userVar } from "../../apollo/store";
import { GET_CART } from "../../apollo/user/query";
import { UPDATE_ORDER } from "../../apollo/user/mutation";
import {
  sweetTopSmallSuccessAlert,
  sweetMixinErrorAlert,
} from "../../libs/sweetAlert";
import { REACT_APP_API_URL } from "../../libs/config";
import { useRouter } from "next/router";

const ProductsCart = () => {
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const [country, setCountry] = useState<string>("South Korea");
  const [shipping, setShipping] = useState<"STANDARD" | "EXPRESS">("STANDARD");
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [showCheckout, setShowCheckout] = useState(false);

  const [updateOrder] = useMutation(UPDATE_ORDER);

  const {
    data,
    loading,
    refetch: refetchCart,
    error,
  } = useQuery(GET_CART, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        page: 1,
        limit: 50,
        orderStatus: "PENDING",
      },
    },
    skip: !user?._id,
  });

  const orders = data?.getMyOrders?.list || [];
  const cartOrder =
    orders.find((order: any) => order.orderStatus === "PENDING") || null;

  const items = Array.isArray(cartOrder?.orderItems)
    ? cartOrder.orderItems
    : cartOrder?.orderItems
    ? [cartOrder.orderItems]
    : [];

  const products = Array.isArray(cartOrder?.productData)
    ? cartOrder.productData
    : cartOrder?.productData
    ? [cartOrder.productData]
    : [];

  const cartTotal = cartOrder?.orderTotal || 0;

  const subtotal = useMemo(() => {
    if (cartTotal) return cartTotal as number;
    return items.reduce(
      (acc: number, item: any) =>
        acc + (item.itemPrice ?? 0) * (item.itemQuantity ?? 1),
      0
    );
  }, [items, cartTotal]);

  const standardFee = 12.79;
  const expressExtra = 29.13;
  const shippingFee =
    shipping === "STANDARD" ? standardFee : standardFee + expressExtra;
  const total = subtotal + shippingFee;

  useEffect(() => {
    if (user?._id) {
      refetchCart();
    }
  }, [user?._id, refetchCart]);

  const handleUpdateQuantity = async (
    itemId: string,
    action: "increment" | "decrement"
  ) => {
    if (!user?._id || !cartOrder) {
      sweetMixinErrorAlert("Please log in to update cart items.");
      return;
    }

    if (updatingItems.has(itemId)) return;

    setUpdatingItems((prev) => new Set([...prev, itemId]));

    try {
      sweetMixinErrorAlert(
        "Quantity updates require backend support. Please contact support."
      );
    } catch (error) {
      sweetMixinErrorAlert("Failed to update cart item.");
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!user?._id || !cartOrder) {
      sweetMixinErrorAlert("Please log in to remove cart items.");
      return;
    }

    if (updatingItems.has(itemId)) return;

    setUpdatingItems((prev) => new Set([...prev, itemId]));

    try {
      sweetMixinErrorAlert(
        "Item removal requires backend support. Please contact support."
      );
    } catch (error) {
      sweetMixinErrorAlert("Failed to remove item from cart.");
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const changeOrderStatus = async (orderId: string, newStatus: string) => {
    if (!user?._id) {
      sweetMixinErrorAlert("Please log in to change order status.");
      return;
    }

    try {
      await updateOrder({
        variables: {
          input: {
            orderId,
            orderStatus: newStatus,
          },
        },
      });

      sweetTopSmallSuccessAlert(
        `Order status changed to ${newStatus} successfully!`
      );
      refetchCart();
    } catch (error) {
      sweetMixinErrorAlert("Failed to change order status.");
    }
  };

  const handleCheckout = async () => {
    if (!user?._id) {
      sweetMixinErrorAlert("Please log in to checkout.");
      return;
    }

    if (items.length === 0) {
      sweetMixinErrorAlert("Your cart is empty.");
      return;
    }

    if (!cartOrder) {
      sweetMixinErrorAlert("Cart order not found.");
      return;
    }

    try {
      await changeOrderStatus(cartOrder._id, "CONFIRMED");
      sweetTopSmallSuccessAlert("Order confirmed successfully!");
      setShowCheckout(true);
    } catch (error) {
      sweetMixinErrorAlert("Failed to proceed to checkout.");
    }
  };

  if (!user?._id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="mx-auto w-full max-w-4xl px-4 py-20">
          <div className="text-center">
            <div className="mx-auto mb-8 h-24 w-24 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 p-1">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                <svg
                  className="h-12 w-12 text-pink-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="mb-4 text-3xl font-bold text-gray-900">Your Cart</h1>
            <p className="mb-8 text-lg text-gray-600">
              Please log in to view your cart and continue shopping.
            </p>
            <button
              onClick={() => router.push("/account/join")}
              className="inline-flex items-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-3 text-white font-semibold shadow-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-200 transform hover:scale-105"
            >
              Sign In to Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="mx-auto w-full max-w-4xl px-4 py-20">
          <div className="text-center">
            <div className="mx-auto mb-8 h-24 w-24 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 p-1">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                <svg
                  className="animate-spin h-12 w-12 text-pink-500"
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
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Loading your cart...
            </h2>
            <p className="text-gray-600">
              Please wait while we fetch your items.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="mx-auto w-full max-w-4xl px-4 py-20">
          <div className="text-center">
            <div className="mx-auto mb-8 h-24 w-24 rounded-full bg-red-100 p-1">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                <svg
                  className="h-12 w-12 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Something went wrong
            </h2>
            <p className="mb-8 text-gray-600">
              We couldn't load your cart. Please try again.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => refetchCart()}
                className="inline-flex items-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 text-white font-semibold shadow-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-200"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push("/product")}
                className="inline-flex items-center rounded-full border-2 border-gray-300 px-6 py-3 text-gray-700 font-semibold hover:border-gray-400 transition-all duration-200"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="mx-auto w-full max-w-4xl px-4 py-20">
          <div className="text-center">
            <div className="mx-auto mb-8 h-24 w-24 rounded-full bg-gray-100 p-1">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                <svg
                  className="h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Your cart is empty
            </h2>
            <p className="mb-8 text-gray-600">
              Looks like you haven't added any items to your cart yet.
            </p>
            <button
              onClick={() => router.push("/product")}
              className="inline-flex items-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-3 text-white font-semibold shadow-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-200 transform hover:scale-105"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            Review your items and proceed to checkout
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Discount Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-1">🎉 Special Offer!</h3>
                  <p className="text-green-100">
                    All products discounted by 25%
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">25% OFF</div>
                  <div className="text-green-100 text-sm">Limited Time</div>
                </div>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="space-y-4">
              {items.map((item: any, index: number) => {
                const product = products[index];
                return (
                  <div
                    key={item._id}
                    className="group rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-6">
                      {/* Product Image */}
                      <div className="relative">
                        <img
                          src={
                            product?.productImages?.[0]
                              ? `${REACT_APP_API_URL}/${product.productImages[0]}`
                              : "/banner/main.jpg"
                          }
                          alt={product?.productTitle || "Product"}
                          className="h-24 w-24 rounded-xl object-cover shadow-sm group-hover:shadow-md transition-shadow duration-200"
                        />
                        {product?.productStock === 0 && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black bg-opacity-50">
                            <span className="text-xs font-semibold text-white bg-red-500 px-2 py-1 rounded-full">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {product?.productTitle || "Product Title"}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {product?.productCategory || "Category"}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                            {product?.productType || "Type"}
                          </span>
                          {product?.productStock !== undefined && (
                            <span className="text-xs font-medium text-gray-600 bg-blue-100 px-2 py-1 rounded-full">
                              Stock: {product.productStock}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item._id, "decrement")
                            }
                            disabled={
                              updatingItems.has(item._id) ||
                              item.itemQuantity <= 1
                            }
                            className="h-10 w-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 12H4"
                              />
                            </svg>
                          </button>
                          <div className="flex h-10 w-16 items-center justify-center rounded-lg border border-gray-200 text-lg font-semibold text-gray-900 bg-white">
                            {item.itemQuantity || 1}
                          </div>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item._id, "increment")
                            }
                            disabled={updatingItems.has(item._id)}
                            className="h-10 w-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right min-w-[120px]">
                          <div className="text-xl font-bold text-gray-900">
                            $
                            {(
                              (item.itemPrice || 0) * (item.itemQuantity || 1)
                            ).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">
                            ${(item.itemPrice || 0).toFixed(2)} each
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          disabled={updatingItems.has(item._id)}
                          className="h-10 w-10 rounded-full bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                        >
                          {updatingItems.has(item._id) ? (
                            <svg
                              className="animate-spin h-5 w-5"
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
                          ) : (
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Checkout Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
                {/* Shipping Options */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Shipping Options
                  </h3>
                  <div className="space-y-3">
                    <button
                      className={`w-full rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                        shipping === "STANDARD"
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setShipping("STANDARD")}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            Standard Shipping
                          </p>
                          <p className="text-sm text-gray-600">
                            8-10 business days
                          </p>
                        </div>
                        <span className="text-lg font-bold text-gray-900">
                          ${standardFee.toFixed(2)}
                        </span>
                      </div>
                    </button>

                    <button
                      className={`w-full rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                        shipping === "EXPRESS"
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setShipping("EXPRESS")}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            Express Shipping
                          </p>
                          <p className="text-sm text-gray-600">
                            2-3 business days
                          </p>
                        </div>
                        <span className="text-lg font-bold text-gray-900">
                          ${(standardFee + expressExtra).toFixed(2)}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Order Summary
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        Subtotal ({items.length} items)
                      </span>
                      <span className="font-semibold text-gray-900">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold text-gray-900">
                        ${shippingFee.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-green-600">
                      <span>Discount (25% off)</span>
                      <span className="font-semibold">
                        -${(subtotal * 0.25).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>${(total - subtotal * 0.25).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={items.length === 0}
                  className="w-full mt-6 h-14 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold text-lg shadow-lg hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  Proceed to Checkout
                </button>

                {/* Continue Shopping */}
                <button
                  onClick={() => router.push("/product")}
                  className="w-full mt-3 h-12 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Checkout Section */}
        {showCheckout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <div className="text-center mb-6">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Order Confirmed!
                </h2>
                <p className="text-gray-600">
                  Your order has been successfully placed.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Order Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(total - subtotal * 0.25).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => router.push("/mypage")}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-200"
                >
                  View My Orders
                </button>
                <button
                  onClick={() => {
                    setShowCheckout(false);
                    router.push("/product");
                  }}
                  className="w-full h-12 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default withLayoutBasic(ProductsCart);
