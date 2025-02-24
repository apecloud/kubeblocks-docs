import { getCurrentLocale } from "@/locales/server";
import { DOCS_DIR, getMarkDownMetaData } from "@/utils/markdown";
import path from "path";
import fs from "fs";
import {
  Avatar,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Grid2 as Grid,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link } from "@/components/Link";
import moment from "moment/min/moment-with-locales";

export default async function BlogsPage() {
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
    <Grid container spacing={4}>
      {blogs.map((blog, index) => {
        return (
          <Grid key={index} size={{ md: 4, sm: 6, xs: 12 }}>
            <Tooltip title={blog.title} placement="top" arrow enterDelay={1000}>
              <Card>
                <CardActionArea
                  component={Link}
                  href={`/blog/${blog.name}`}
                  underline="none"
                >
                  <CardMedia sx={{ height: 200 }} image={blog.image} />
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
  );
}
