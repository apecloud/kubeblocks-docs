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
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import { Link } from "@/components/Link";

export default async function BlogsPage() {
  const currentLocale = await getCurrentLocale();
  let blogsDir = path.join(DOCS_DIR, currentLocale, "blogs");
  if(!fs.existsSync(blogsDir)) {
    blogsDir = path.join(DOCS_DIR, "en", "blogs");
  }

  const files = fs
    .readdirSync(blogsDir)
    .filter((file) => file.endsWith(".mdx"));

  const blogs = await Promise.all(
    files.map(async (file) => {
      const data = await getMarkDownMetaData(path.join(blogsDir, file));
      data.name = file.replace(/\.mdx$/, "")
      return data;
    })
  );

  return (
    <Grid container spacing={4}>
      {blogs.map((blog, index) => {
        return (
          <Grid key={index} size={{ md: 4, sm: 6, xs: 12 }}>
            <Card>
              <CardActionArea component={Link} href={`/blogs/${blog.name}`} underline="none">
                <CardMedia sx={{ height: 220 }} image={blog.image} />
                <CardContent sx={{ height: 150 }}>
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
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {blog.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Avatar src={blog.authors?.image_url}/>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {blog.authors?.name}
                  </Typography>
                </CardActions>
              </CardActionArea>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
