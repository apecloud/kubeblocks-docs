'use client';

import { Link } from '@/components/Link';
import { BlogMetadata } from '@/utils/markdown';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Grid2 as Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import _ from 'lodash';
import Image from 'next/image';
import { useMemo, useState } from 'react';

export const BlogList = ({ blogs }: { blogs: BlogMetadata[] }) => {
  const [checkedTags, setCheckedTags] = useState<string[]>([]);
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');

  const handleTagClick = (tag: string) => {
    setCheckedTags((items) => {
      return items.includes(tag)
        ? items.filter((c) => c !== tag)
        : items.concat(tag);
    });
  };

  const filterTags = useMemo(
    () => _.uniq(_.flattenDeep(blogs.map((blog) => blog.tags || []))),
    [blogs],
  );

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

  return (
    <>
      <Stack mb={2} direction="row" alignItems="start">
        <Stack flex={1} flexWrap="wrap" direction="row">
          <Chip
            label="All Tags"
            color={
              checkedTags.length === 0 ||
              checkedTags.length === filterTags.length
                ? 'primary'
                : 'default'
            }
            sx={{ m: 0.25 }}
            onClick={() => setCheckedTags([])}
          />
          {filterTags.map((tag, index) => (
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
          <IconButton onClick={() => setSort(sort === 'desc' ? 'asc' : 'desc')}>
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
    </>
  );
};
