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
import { Evaluate } from "./Evaluate";

async function getPlayerUrl() {
  let url = "https://www.youtube.com/embed/KNwpG51Whzg?si=wCQ-31H3OiI7aMtZ";
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    if (["CN", "HK"].includes(data.country)) {
      url = "https://player.bilibili.com/player.html?bvid=BV1ew41137Sn";
    }
  } catch (err) {
    console.log(err);
  }
  return url;
}

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

  const playerUrl = await getPlayerUrl();

  return (
    <>
      <Box style={{ minHeight: "var(--container-min-height)" }}>
        <Banner />
        <Divider />
        <Customers />
        <Divider />
        <Evaluate playerUrl={playerUrl} />
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
