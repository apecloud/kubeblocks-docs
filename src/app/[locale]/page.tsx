import Footer from "@/components/Footer";
import { Box, Divider } from "@mui/material";
import WhyNeedKubeBlocks from "./why-need-kubeblocks";
import Banner from "./banner";
import Features from "./features";
import Contact from "./contact";
import BlogsPreview from "./blogs-preview";
import { getCurrentLocale } from "@/locales/server";
import { getBlogs } from "@/utils/markdown";

export default async function HomePage() {
  const currentLocale = await getCurrentLocale();
  const blogs = await getBlogs(currentLocale);

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
