import { getScopedI18n } from "@/locales/server";

export default async function Home() {
  const t = await getScopedI18n("HomePage");
  return <h1>{t("title")}</h1>;
}
