import { setStaticParamsLocale } from "next-international/server";
import { ArrowBack } from "@mui/icons-material";
import { getI18n } from "@/locales/server";
import { Box, Button, Container } from "@mui/material";
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
    <Box sx={{ marginRight: '300px', paddingBlock: 3 }}>
      <Container
        sx={{ minHeight: "var(--container-min-height)"}}
        className="markdown-body"
      >
        <Box sx={{ marginBottom: 4 }}>
          <Button startIcon={<ArrowBack />} component={Link} href="/blog">
            {t("actions.back")}
          </Button>
        </Box>
        {children}
      </Container>
    </Box>
  );
}
