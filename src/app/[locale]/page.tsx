import Footer from "@/components/Footer";
import {
  Box,
  Divider,
} from "@mui/material";
import WhyNeedKubeBlocks from "./why-need-kubeblocks";
import Banner from "./banner";
import Features from "./features";
import Contact from "./contact";

export default function HomePage() {


  return (
    <>
      <Box style={{ minHeight: "calc(100vh - 265px)" }}>
        <Banner />
        <Divider />
        <WhyNeedKubeBlocks />

        <Features />
        <Contact />
      </Box>
      <Footer />
    </>
  );
}
