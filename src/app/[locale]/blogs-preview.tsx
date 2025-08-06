'use client';
import { Link } from '@/components/Link';
import { BlogMetadata } from '@/utils/markdown';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import {
  alpha,
  Box,
  BoxProps,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

const NextArrow = (props: BoxProps) => (
  <Box
    className={props.className}
    onClick={props.onClick}
    sx={{
      '&:before': {
        display: 'none',
      },
    }}
  >
    <KeyboardArrowRight color="action" />
  </Box>
);
const PrevArrow = (props: BoxProps) => (
  <Box
    className={props.className}
    onClick={props.onClick}
    sx={{
      '&:before': {
        display: 'none',
      },
    }}
  >
    <KeyboardArrowLeft color="action" />
  </Box>
);

export default function BlogsPreview({ blogs }: { blogs: BlogMetadata[] }) {
  const theme = useTheme();
  const settings = {
    dots: false,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: (dots: never) => <Box component="ul">{dots}</Box>,
    customPaging: () => (
      <Box
        component={'button'}
        sx={{
          '&:before': {
            color: `${theme.palette.text.disabled} !important`,
          },
        }}
      />
    ),
    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };
  return (
    <Box
      sx={{
        paddingBlock: 12,
        background: alpha(theme.palette.background.paper, 0.2),
      }}
    >
      <Container>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4">Explore KubeBlocks Insights</Typography>
        </Box>
        <Box className="slider-container">
          <Slider {...settings}>
            {blogs.map((blog, index) => (
              <Box key={index} sx={{ padding: 1 }}>
                <Tooltip title={blog.title} placement="top" arrow>
                  <Card
                    sx={{
                      boxShadow: 'none',
                      border: 1,
                      borderColor: 'divider',
                    }}
                  >
                    <CardActionArea
                      component={Link}
                      href={`/blog/${blog.name}`}
                      underline="none"
                      target="_blank"
                    >
                      <Box
                        sx={{
                          height: 140,
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
                </Tooltip>
              </Box>
            ))}
          </Slider>
        </Box>
      </Container>
    </Box>
  );
}
