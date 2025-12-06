import Footer from '@/components/Footer';
import { Box } from '@mui/material';

export default async function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box>
      {children}
      <Footer />
    </Box>
  );
}
