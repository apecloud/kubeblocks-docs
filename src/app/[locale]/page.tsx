import Footer from "@/components/Footer";
import { Box, Divider } from "@mui/material";
import WhyNeedKubeBlocks from "./why-need-kubeblocks";
import Banner from "./banner";
import Features from "./features";
import Contact from "./contact";
import BlogsPreview from "./blogs-preview";
import { getBlogs } from "@/utils/markdown";
import Customers from "./customers";
import { getStaticParams } from "@/locales/server";

export async function generateStaticParams() {
  return getStaticParams();
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const blogs = await getBlogs(locale);
  return (
    <>
      <Box style={{ minHeight: "var(--container-min-height)" }}>
        <Banner />
        <Divider />
        <Customers />
        <Divider />
        <WhyNeedKubeBlocks />
        <Divider />
        <Features />
        <Contact />
        <BlogsPreview blogs={blogs} />
      </Box>
      <Footer />
    </>
  );
}
