'use client';

import { Link } from '@/components/Link';
import { BlogMetadata } from '@/utils/markdown';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Grid2 as Grid,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import _ from 'lodash';
import Image from 'next/image';
import { useMemo, useState } from 'react';

export const BlogList = ({
  blogs,
  tags,
}: {
  blogs: BlogMetadata[];
  tags: string[];
}) => {
  const [value, setValue] = useState<number>(0);
  const [checkedTags, setCheckedTags] = useState<string[]>([]);
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');

  const handleTagClick = (tag: string) => {
    setCheckedTags((items) => {
      return items.includes(tag)
        ? items.filter((c) => c !== tag)
        : items.concat(tag);
    });
  };

  const filterBlogs = useMemo(() => {
    let data: BlogMetadata[] = [...blogs];
    if (checkedTags.length !== 0) {
      data = data.filter((blog) =>
        blog.tags.some((t) => checkedTags.includes(t)),
      );
    }
    if (sort === 'asc') {
      data.reverse();
    }
    return data;
  }, [blogs, checkedTags, sort]);

  const useCases = blogs
    .filter((b) => b.tags.some((t) => ['Use Case'].includes(t)))
    .splice(0, 4);

  const addons = blogs
    .filter((b) => b.tags.some((t) => ['Addons'].includes(t)))
    .splice(0, 6);

  const engineering = blogs
    .filter((b) => b.tags.some((t) => ['Addons'].includes(t)))
    .splice(0, 4);

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }} mt={6} mb={4}>
        <Tabs value={value} onChange={(e, newValue) => setValue(newValue)}>
          <Tab label="Featured Posts" />
          <Tab label="All Posts" />
        </Tabs>
      </Box>

      <Box hidden={value !== 0} mb={12} mt={8}>
        <Box mb={16}>
          <Typography variant="h4" mb={2} textAlign="center">
            Database Deep Dives
          </Typography>
          <Typography mb={8} color="textSecondary" textAlign="center">
            This series gives developers and engineers practical insights on
            database scalability, fault tolerance, and performance tuning.
            Combining theory with real-world examples, it helps teams optimize
            and troubleshoot databases across on-prem, cloud, and Kubernetes
            environments like KubeBlocks.
          </Typography>

          {engineering.map((blog, index) => {
            return (
              <Grid
                key={index}
                container
                spacing={4}
                sx={{
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  paddingBlock: 4,
                }}
              >
                <Grid size={{ sm: 4, md: 3 }} sx={{ position: 'relative' }}>
                  <Image
                    src={blog.image}
                    fill
                    alt={blog.title}
                    style={{ borderRadius: 8, maxWidth: '100%' }}
                  />
                </Grid>
                <Grid size={{ sm: 8, md: 9 }}>
                  <Typography variant="h5" mb={2} noWrap>
                    {blog.title}
                  </Typography>
                  <Typography
                    height={70}
                    overflow="hidden"
                    mb={1}
                    color="textSecondary"
                  >
                    {_.truncate(blog.description, { length: 200 })}
                  </Typography>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" gap={1} alignItems="center">
                      <Avatar
                        src={blog.authors?.image_url || '/apecloud.png'}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                      >
                        {blog.authors?.name || 'KubeBlocks'}
                      </Typography>
                    </Stack>
                    <Button
                      LinkComponent={Link}
                      href={`/blog/${blog.name}`}
                      target="_blank"
                      sx={{ paddingInline: 3 }}
                      variant="outlined"
                    >
                      Read More
                      <KeyboardArrowRightIcon />
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            );
          })}
        </Box>

        <Box mb={16}>
          <Typography variant="h4" mb={2} textAlign="center">
            Customer Success Stories
          </Typography>
          <Typography mb={8} color="textSecondary" textAlign="center">
            Discover how our products and services have helped businesses like
            yours achieve remarkable results. From overcoming challenges to
            reaching new milestones, these real-life success stories showcase
            the tangible impact we deliver. Explore inspiring testimonials and
            case studies to see how we can empower your success too.
          </Typography>
          <Grid container spacing={6}>
            {useCases.map((blog, index) => {
              return (
                <Grid key={index} size={{ md: 6 }}>
                  <Tooltip title={blog.title} placement="top" arrow>
                    <Typography variant="h5" mb={2} noWrap>
                      {blog.title}
                    </Typography>
                  </Tooltip>
                  <Typography
                    height={70}
                    overflow="hidden"
                    mb={1}
                    color="textSecondary"
                  >
                    {_.truncate(blog.description, { length: 200 })}
                  </Typography>
                  <Button
                    LinkComponent={Link}
                    href={`/blog/${blog.name}`}
                    target="_blank"
                  >
                    View Full Story
                    <KeyboardArrowRightIcon />
                  </Button>
                  <Divider sx={{ mt: 6 }} />
                </Grid>
              );
            })}
          </Grid>
        </Box>

        <Box>
          <Typography variant="h4" mb={2} textAlign="center">
            Database Engines in KubeBlocks Addon
          </Typography>
          <Typography mb={8} color="textSecondary" textAlign="center">
            KubeBlocks Addon provides a unified platform for managing multiple
            database engines in Kubernetes, enabling seamless deployment,
            scaling, and operation of both SQL and NoSQL databases. With
            built-in support for popular engines like MySQL (InnoDB),
            PostgreSQL, MongoDB, Redis, and Cassandra, KubeBlocks simplifies
            database lifecycle management while ensuring high availability,
            automated backups, and performance optimization.
          </Typography>
          <Grid container spacing={2}>
            {addons.map((blog, index) => {
              return (
                <Grid key={index} size={{ sm: 6, md: 4 }}>
                  <Card variant="outlined">
                    <CardActionArea
                      component={Link}
                      href={`/blog/${blog.name}`}
                      underline="none"
                      target="_blank"
                    >
                      <Box
                        sx={{
                          height: 180,
                          width: '100%',
                          position: 'relative',
                        }}
                      >
                        <Image fill src={blog.image} alt={blog.title} />
                      </Box>
                      <CardContent>
                        <Typography
                          gutterBottom
                          sx={{
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {blog.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ height: 40, overflow: 'hidden' }}
                        >
                          {blog.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Box>

      <Box hidden={value !== 1}>
        <Stack mb={2} direction="row" alignItems="start">
          <Stack flex={1} flexWrap="wrap" direction="row">
            <Chip
              label="All Tags"
              color={
                checkedTags.length === 0 || checkedTags.length === tags.length
                  ? 'primary'
                  : 'default'
              }
              sx={{ m: 0.25 }}
              onClick={() => setCheckedTags([])}
            />
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                color={checkedTags.includes(tag) ? 'primary' : 'default'}
                onClick={() => handleTagClick(tag)}
                sx={{ m: 0.25 }}
              />
            ))}
          </Stack>
          <Tooltip title="Sort by creation time" placement="top" arrow>
            <IconButton
              onClick={() => setSort(sort === 'desc' ? 'asc' : 'desc')}
            >
              <FilterListIcon
                sx={{ transform: `rotate(${sort === 'desc' ? 0 : 180}deg)` }}
              />
            </IconButton>
          </Tooltip>
        </Stack>
        <Grid container spacing={3}>
          {filterBlogs.map((blog, index) => {
            return (
              <Grid key={index} size={{ lg: 4, md: 4, sm: 6, xs: 12 }}>
                <Card variant="outlined">
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
                        <Avatar
                          src={blog.authors?.image_url || '/apecloud.png'}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary' }}
                        >
                          {blog.authors?.name || 'KubeBlocks'}
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
      </Box>
    </>
  );
};
