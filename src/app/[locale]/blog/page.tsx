import { Link } from '@/components/Link';
import { getStaticParams } from '@/locales/server';
import { getBlogs } from '@/utils/markdown';
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Container,
  Divider,
  Grid2 as Grid,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import Image from 'next/image';

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
      <Grid container spacing={3}>
        {blogs.map((blog, index) => {
          return (
            <Grid key={index} size={{ lg: 4, md: 4, sm: 6, xs: 12 }}>
              <Card
                sx={{
                  boxShadow: 'none',
                  border: '1px solid var(--css-palette-divider)',
                }}
              >
                <CardActionArea
                  component={Link}
                  href={`/blog/${blog.name}`}
                  underline="none"
                >
                  <Box
                    sx={{ height: 180, width: '100%', position: 'relative' }}
                  >
                    <Image fill src={blog.image} alt={blog.title} />
                  </Box>
                  <CardContent>
                    <Typography gutterBottom variant="subtitle1" noWrap>
                      {blog.title}
                    </Typography>
                    <Tooltip title={blog.description} placement="top" arrow>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          height: 60,
                          overflow: 'hidden',
                        }}
                      >
                        {blog.description}
                      </Typography>
                    </Tooltip>
                  </CardContent>

                  <Divider />
                  <CardActions sx={{ justifyContent: 'space-between' }}>
                    <Stack direction="row" gap={1} alignItems="center">
                      <Avatar src={blog.authors?.image_url} />
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                      >
                        {blog.authors?.name}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      {blog.datetime}
                    </Typography>
                  </CardActions>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
