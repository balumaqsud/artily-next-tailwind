import * as React from "react";
import { Image, ThumbsUp, Leaf } from "lucide-react";
import { useTranslation } from "next-i18next";

type ValueItem = {
  title: string;
  description: string;
  icon?: React.ReactNode;
};

export default function ValueProps({
  items,
  className,
}: {
  items?: ValueItem[];
  className?: string;
}) {
  const { t } = useTranslation("common");
  
  const defaultItems: ValueItem[] = [
    {
      title: t("Every order pays an artist"),
      description: t("Your purchase sends money straight to the creator."),
      icon: <ThumbsUp className="h-7 w-7" />,
    },
    {
      title: t("Lower‑impact production"),
      description: t("We offset carbon and choose responsible materials."),
      icon: <Leaf className="h-7 w-7" />,
    },
    {
      title: t("Original designs to wear & share"),
      description: t("Explore thousands of artworks across 90+ premium products."),
      icon: <Image className="h-7 w-7" />,
    },
  ];

  const data = items && items.length > 0 ? items : defaultItems;

  return (
    <section className={"w-full px-4 " + (className ?? "")}>
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 gap-8 py-8 pl-4 md:grid-cols-3">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-start gap-6">
              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {item.icon ?? <Image className="h-8 w-8" />}
              </div>
              <div className="px-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
