import { setStaticParamsLocale } from "next-international/server";
import { ArrowBack } from "@mui/icons-material";
import { getI18n } from "@/locales/server";
import { Box, Button } from "@mui/material";
import { Link } from "@/components/Link";

export default async function BlogsDetail({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: "zh" | "en" }>;
}) {
  const { locale } = await params;
  setStaticParamsLocale(locale);
  const t = await getI18n();

  return (
    <>
      <Box sx={{ marginBottom: 4 }}>
        <Button startIcon={<ArrowBack />} component={Link} href="/blog">
          {t("actions.back")}
        </Button>
      </Box>
      {children}
    </>
  );
}
