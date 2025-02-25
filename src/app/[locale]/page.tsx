import Footer from "@/components/Footer";
import { Box, Divider } from "@mui/material";
import WhyNeedKubeBlocks from "./why-need-kubeblocks";
import Banner from "./banner";
import Features from "./features";
import Contact from "./contact";
import BlogsPreview from "./blogs-preview";
import { getBlogs } from "@/utils/markdown";

import { setStaticParamsLocale } from "next-international/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const blogs = await getBlogs(locale);
  return (
    <>
      <Box style={{ minHeight: "calc(100vh - 265px)" }}>
        <Banner />
        <Divider />
        <WhyNeedKubeBlocks />
        <Divider />
        <Features />
        <Divider />
        <BlogsPreview blogs={blogs} />
        <Divider />
        <Contact />
      </Box>
      <Footer />
    </>
  );
}
