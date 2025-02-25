import Footer from "@/components/Footer";
import {
  Box,
  Divider,
} from "@mui/material";
import WhyNeedKubeBlocks from "./why-need-kubeblocks";
import Banner from "./banner";
import Features from "./features";
import Contact from "./contact";
import BlogsPreview from "./blogs-preview";
import { getCurrentLocale } from "@/locales/server";
import moment from "moment";
import { DOCS_DIR, getMarkDownMetaData } from "@/utils/markdown";
import path from "path";
import fs from "fs";

export default async function HomePage() {
const currentLocale = await getCurrentLocale();
  moment.locale(currentLocale);
  let blogsDir = path.join(DOCS_DIR, currentLocale, "blogs");
  if (!fs.existsSync(blogsDir)) {
    blogsDir = path.join(DOCS_DIR, "en", "blogs");
  }
  const files = fs
    .readdirSync(blogsDir)
    .filter((file) => file.endsWith(".mdx"));

  const blogs = (
    await Promise.all(
      files.map(async (file) => {
        const data = await getMarkDownMetaData(path.join(blogsDir, file));
        data.name = file.replace(/\.mdx$/, "");
        return data;
      })
    )
  )
    .map((blog) => {
      blog.datetime = moment(blog.date).format("LL");
      return blog;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
