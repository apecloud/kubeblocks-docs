import Footer from "@/components/Footer";
import { Container } from "@mui/material";
import { setStaticParamsLocale } from "next-international/server";

export default async function BlogsLayout({ children, params }: { children: React.ReactNode, params: Promise<{ locale: "zh" | "en" }> }) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  return (
    <>
      <Container sx={{ minHeight: "calc(100vh - 265px)", paddingBlock: 4 }} className="markdown-body">
        {children}
      </Container>
      <Footer />
    </>
  );
}
