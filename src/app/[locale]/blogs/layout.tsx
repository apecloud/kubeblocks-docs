import Footer from "@/components/Footer";
import { Container } from "@mui/material";

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Container sx={{ minHeight: "calc(100vh - 265px)", paddingBlock: 4 }}>
        {children}
      </Container>
      <Footer />
    </>
  );
}
