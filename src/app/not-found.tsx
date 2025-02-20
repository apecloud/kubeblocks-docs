import { Link } from "@/components/Link";
import { getScopedI18n } from "@/locales/server";
import { Box } from "@mui/material";

export default async function NotFound() {
  const t = await getScopedI18n("404");
  return (
    <Box>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">{t("back")}</Link>
    </Box>
  )
}