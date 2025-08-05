import { getStaticParams } from '@/locales/server';
import { getBlogs } from '@/utils/markdown';
import { Container } from '@mui/material';
import { BlogList } from './BlogList';

export async function generateStaticParams() {
  return getStaticParams();
}

export async function generateMetadata() {
  return {
    title: 'Kubeblocks blogs',
  };
}

export default async function BlogsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const blogs = await getBlogs(locale);

  return (
    <Container
      sx={{ minHeight: 'var(--container-min-height)', paddingBlock: 6 }}
    >
      <BlogList blogs={blogs} />
    </Container>
  );
}
