import Footer from '@/components/Footer';
import { getStaticParams } from '@/locales/server';
import { getBlogs } from '@/utils/markdown';
import { Box, Divider } from '@mui/material';
import Banner from './banner';
import BlogsPreview from './blogs-preview';
import Contact from './contact';
import Customers from './customers';
import { Evaluate } from './Evaluate';
import Features from './features';
import WhyNeedKubeBlocks from './why-need-kubeblocks';

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
      <Box style={{ minHeight: 'var(--container-min-height)' }}>
        <Banner />
        <Divider />
        <Customers />
        <Divider />
        <Evaluate />
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
