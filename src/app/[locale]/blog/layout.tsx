import Footer from "@/components/Footer";
import { Box } from "@mui/material";
import { setStaticParamsLocale } from "next-international/server";

export default async function BlogsLayout({ children, params }: { children: React.ReactNode, params: Promise<{ locale:  "en" }> }) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  return (
    <Box>
      {children}
      <Footer />
    </Box>
  );
}
