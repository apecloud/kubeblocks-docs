import { getBlogs } from "@/utils/markdown";
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
} from "@mui/material";
import { Link } from "@/components/Link";
import { getStaticParams } from "@/locales/server";
import Image from "next/image";

export function generateStaticParams() {
  return getStaticParams();
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
      sx={{ minHeight: "var(--container-min-height)", paddingBlock: 3 }}
    >
      <Grid container spacing={4}>
        {blogs.map((blog, index) => {
          return (
            <Grid key={index} size={{ md: 4, sm: 6, xs: 12 }}>
              <Tooltip
                title={blog.title}
                placement="top"
                arrow
                enterDelay={1000}
              >
                <Card
                  sx={{
                    boxShadow: "none",
                    border: "1px solid var(--css-palette-divider)",
                  }}
                >
                  <CardActionArea
                    component={Link}
                    href={`/blog/${blog.name}`}
                    underline="none"
                  >
                    <Box
                      sx={{ height: 200, width: "100%", position: "relative" }}
                    >
                      <Image fill src={blog.image} alt={blog.title} />
                    </Box>
                    <CardContent sx={{ height: 160 }}>
                      <Typography
                        gutterBottom
                        variant="h6"
                        sx={{
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {blog.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {blog.description}
                      </Typography>
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ justifyContent: "space-between" }}>
                      <Stack direction="row" gap={2} alignItems="center">
                        <Avatar src={blog.authors?.image_url} />
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          {blog.authors?.name}
                        </Typography>
                      </Stack>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {blog.datetime}
                      </Typography>
                    </CardActions>
                  </CardActionArea>
                </Card>
              </Tooltip>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
