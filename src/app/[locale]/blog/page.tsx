import { getStaticParams } from '@/locales/server';
import { getBlogs } from '@/utils/markdown';
import {
  Button,
  Card,
  Container,
  Grid2 as Grid,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import _ from 'lodash';
import type { Metadata } from 'next';
import Image from 'next/image';
import { BlogList } from './BlogList';
export async function generateStaticParams() {
  return getStaticParams();
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Kubeblocks blogs',
    description:
      'Technical blogs, release highlights, and engineering guides for running databases on Kubernetes with KubeBlocks.',
    alternates: {
      canonical: '/blog',
    },
  };
}

export default async function BlogsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const allBlogs = await getBlogs(locale);
  const tags = _.uniq(_.flattenDeep(allBlogs.map((blog) => blog.tags || [])));
  const latest = allBlogs.splice(0, 1)[0];

  return (
    <Container
      sx={{ minHeight: 'var(--container-min-height)', paddingBlock: 6 }}
    >
      <Card variant="outlined">
        <Grid container>
          <Grid p={4} size={{ md: 8 }}>
            <Typography variant="h4" gutterBottom>
              {latest.title}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }} mb={4}>
              {latest.description}
            </Typography>

            <Stack direction="row" spacing={4}>
              <Button
                variant="contained"
                LinkComponent={Link}
                href={`/blog/${latest.name}`}
                size="large"
                sx={{ boxShadow: 'none', paddingInline: 4 }}
                target="_blank"
              >
                Read More
              </Button>
            </Stack>
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

      <BlogList blogs={allBlogs} tags={tags} />
    </Container>
  );
}
