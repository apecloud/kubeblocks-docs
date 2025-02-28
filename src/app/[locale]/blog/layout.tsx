import Footer from "@/components/Footer";
import { Container } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { getI18n } from "@/locales/server";
import { Box, Button } from "@mui/material";
import { Link } from "@/components/Link";
import { setStaticParamsLocale } from "next-international/server";

export default async function BlogsLayout({ children, params }: { children: React.ReactNode, params: Promise<{ locale: "zh" | "en" }> }) {
  const { locale } = await params;
  setStaticParamsLocale(locale);
  const t = await getI18n();

  return (
    <>
      <Container sx={{ minHeight: "calc(100vh - 265px)", paddingBlock: 4 }} className="markdown-body">
        <Box sx={{ marginBottom: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            component={Link}
            href="/blog"
          >
            {t("actions.back")}
          </Button>
        </Box>
        {children}
      </Container>
      <Footer />
    </>
  );
}
