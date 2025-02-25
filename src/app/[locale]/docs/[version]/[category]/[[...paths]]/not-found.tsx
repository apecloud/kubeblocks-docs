import { Link } from "@/components/Link";
import { getScopedI18n } from "@/locales/server";

import { Result } from "@/components/Result";

export default async function NotFoundPage() {
  const t = await getScopedI18n("404");
  
  return (
    <Result
      status="notfound"
      title="404"
      description="Could not find requested resource"
      actions={<Link href="/">{t("back")}</Link>}
    />
  );
}
