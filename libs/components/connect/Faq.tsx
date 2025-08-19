import React, { SyntheticEvent, useState } from "react";

const Faq = () => {
  const [category, setCategory] = useState<string>("product");
  const [expanded, setExpanded] = useState<string | false>("");

  /** HANDLERS **/
  const changeCategoryHandler = (cat: string) => {
    setCategory(cat);
    setExpanded("");
  };

  const handleChange = (panel: string) => (e: SyntheticEvent) => {
    setExpanded((prev) => (prev === panel ? "" : panel));
  };

  // E-commerce oriented FAQ data (Artly)
  const data: any = {
    product: [
      {
        id: "p-001",
        subject: "Are products authentic and handmade?",
        content:
          "Most items on Artly are handmade or designed by independent sellers. Each product page shows materials, origin, and seller details.",
      },
      {
        id: "p-002",
        subject: "How do I find the right size or variation?",
        content:
          "Use the variation selector (size/color/material) on the product page. If a guide is available, you'll see a Size Guide link under the options.",
      },
      {
        id: "p-003",
        subject: "What if an item is out of stock?",
        content:
          "Out-of-stock products show as unavailable. You can favorite the item to get notified when it’s back or message the seller for a custom order.",
      },
      {
        id: "p-004",
        subject: "Can I request a custom product?",
        content:
          "Yes. Many sellers accept custom orders. Use the 'Message seller' button on the product page to describe your request.",
      },
    ],
    orders: [
      {
        id: "o-001",
        subject: "How do I place an order?",
        content:
          "Add products to cart, review shipping details at checkout, and complete payment. You’ll receive an order confirmation by email.",
      },
      {
        id: "o-002",
        subject: "Can I edit or cancel my order?",
        content:
          "If the order isn’t shipped yet, you can request a change or cancellation from your Orders page. The seller will confirm the update.",
      },
      {
        id: "o-003",
        subject: "How do I track my order?",
        content:
          "Go to My Page → Recently Visited/Orders to view tracking. We’ll email tracking as soon as the seller ships.",
      },
    ],
    shipping: [
      {
        id: "s-001",
        subject: "What are the shipping options and costs?",
        content:
          "Shipping methods and costs are set by each seller and shown at checkout. Some products offer free or combined shipping.",
      },
      {
        id: "s-002",
        subject: "Do you ship internationally?",
        content:
          "Many sellers ship worldwide. Availability depends on the seller. Check the Shipping section on the product page.",
      },
      {
        id: "s-003",
        subject: "My package is delayed—what should I do?",
        content:
          "Check tracking first. If it’s stuck, message the seller. If you need help, contact Artly Support with your order ID.",
      },
    ],
    payments: [
      {
        id: "pay-001",
        subject: "Which payment methods are accepted?",
        content:
          "We accept major credit/debit cards and select local methods depending on your region. All payments are processed securely.",
      },
      {
        id: "pay-002",
        subject: "Is my payment information secure?",
        content:
          "Yes. Artly uses industry-standard encryption. Sellers never see your card details.",
      },
      {
        id: "pay-003",
        subject: "Can I split payment for a large order?",
        content:
          "Split payments aren’t supported yet. For bulk or custom orders, message the seller to discuss options.",
      },
    ],
    returns: [
      {
        id: "r-001",
        subject: "What is the return and refund policy?",
        content:
          "Return windows vary by seller and product type. See the Returns section on the product page. If the item arrives damaged, contact the seller within 48 hours.",
      },
      {
        id: "r-002",
        subject: "How do I start a return?",
        content:
          "Go to My Page → My Orders, select the order, then choose Request Return. Provide photos if the product is damaged.",
      },
      {
        id: "r-003",
        subject: "When will I get my refund?",
        content:
          "Refunds are issued after the item is received and inspected by the seller. Processing times vary by payment method (3–10 business days).",
      },
    ],
    sellers: [
      {
        id: "sel-001",
        subject: "How do I become a seller on Artly?",
        content:
          "Create an account and apply to open a shop from My Page. Add product details, photos, and shipping settings to start selling.",
      },
      {
        id: "sel-002",
        subject: "How are fees calculated?",
        content:
          "Artly charges a small service fee per transaction. You can review fee details in the Shop → Settings → Billing section.",
      },
      {
        id: "sel-003",
        subject: "How do I handle custom orders and messages?",
        content:
          "Use the inbox in My Page to communicate with buyers. Set expectations for lead time and pricing before accepting.",
      },
    ],
    account: [
      {
        id: "acc-001",
        subject: "How do I change my email, phone, or password?",
        content:
          "Open My Page → My Profile to update your info. For password changes, follow the security prompts.",
      },
      {
        id: "acc-002",
        subject: "How do favorites and follows work?",
        content:
          "Click the heart on a product to save it, or follow a seller to get updates when they list new products.",
      },
    ],
    other: [
      {
        id: "oth-001",
        subject: "How do I report an issue with a product or seller?",
        content:
          "Use the Report button on the product page or contact Artly Support from My Page. Include order ID and screenshots if possible.",
      },
    ],
  };

  const categories = [
    "product",
    "orders",
    "shipping",
    "payments",
    "returns",
    "sellers",
    "account",
    "other",
  ];

  return (
    <div className="w-full">
      {/* Category pills */}
      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => changeCategoryHandler(c)}
            className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${
              category === c
                ? "border-transparent bg-[#ff6b81] text-white"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Accordion list */}
      <div className="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {(data[category] || []).map((ele: any) => (
          <div key={ele.id} className="">
            <button
              onClick={handleChange(ele.id)}
              className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                  Q
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {ele.subject}
                </span>
              </div>
              <span
                className={`transition ${
                  expanded === ele.id ? "rotate-180" : ""
                }`}
              >
                ▾
              </span>
            </button>
            {expanded === ele.id && (
              <div className="px-4 pb-4">
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#ff6b81]/10 text-xs font-semibold text-[#ff6b81]">
                    A
                  </span>
                  <p>{ele.content}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
