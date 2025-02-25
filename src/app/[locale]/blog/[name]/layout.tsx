import { setStaticParamsLocale } from "next-international/server";

export default async function BlogsDetail({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: "zh" | "en" }>;
}) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  return children;
}
