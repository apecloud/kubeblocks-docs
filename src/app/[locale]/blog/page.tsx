import { getStaticParams } from '@/locales/server';
import { getBlogs } from '@/utils/markdown';
import {
  Button,
  Card,
  Container,
  Grid2 as Grid,
  Link,
  Typography,
} from '@mui/material';
import Image from 'next/image';
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

  const latest = blogs.splice(0, 1)[0];

  return (
    <Container
      sx={{ minHeight: 'var(--container-min-height)', paddingBlock: 6 }}
    >
      <Card variant="outlined" sx={{ mb: 8 }}>
        <Grid container>
          <Grid p={4} size={{ md: 8 }}>
            <Typography variant="h4" gutterBottom>
              {latest.title}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }} mb={4}>
              {latest.description}
            </Typography>
            <Button
              variant="contained"
              LinkComponent={Link}
              href={`/blog/${latest.name}`}
              size="large"
              sx={{ boxShadow: 'none', paddingInline: 4 }}
            >
              Read More
            </Button>
          </Grid>
          <Grid p={2} size={{ md: 4 }}>
            <Image
              src={latest.image}
              width={360}
              height={220}
              alt=""
              style={{ borderRadius: 4, width: '100%' }}
            />
          </Grid>
        </Grid>
      </Card>

      <BlogList blogs={blogs} />
    </Container>
  );
}
