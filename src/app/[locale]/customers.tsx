"use client";

import { Box, BoxProps, Container, Typography, useTheme } from "@mui/material";
import Image from "next/image";

import boncloud from "@/assets/customers/boncloud.svg";
import ecloud from "@/assets/customers/ecloud.svg";
import kuaishou from "@/assets/customers/kuaishou.svg";
import logo360 from "@/assets/customers/logo360.svg";
import momenta from "@/assets/customers/momenta.svg";
import sealos from "@/assets/customers/sealos.svg";
import tencent from "@/assets/customers/tencent.svg";
import weipinhui from "@/assets/customers/weipinhui.svg";
import xiaomi from "@/assets/customers/xiaomi.svg";
import zhongxinzhengquan from "@/assets/customers/zhongxinzhengquan.svg";
import tigerbrokers from "@/assets/customers/tigerbrokers.svg";

import Slider from "react-slick";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

const customers = [
  {
    img: boncloud,
    title: "东方国信云",
  },
  {
    img: ecloud,
    title: "移动云",
  },
  {
    img: kuaishou,
    title: "快手",
  },
  {
    img: logo360,
    title: "360",
  },
  {
    img: momenta,
    title: "Momenta",
  },
  {
    img: sealos,
    title: "SealOS",
  },
  {
    img: tencent,
    title: "Tencent",
  },
  {
    img: weipinhui,
    title: "唯品会",
  },
  {
    img: xiaomi,
    title: "小米",
  },
  {
    img: zhongxinzhengquan,
    title: "中信证券",
  },
  {
    img: tigerbrokers,
    title: "老虎证券",
  },
];

const NextArrow = (props: BoxProps) => (
  <Box
    className={props.className}
    onClick={props.onClick}
    sx={{
      "&:before": {
        display: "none",
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
      "&:before": {
        display: "none",
      },
    }}
  >
    <KeyboardArrowLeft color="action" />
  </Box>
);

export default function Customers() {
  const theme = useTheme();
  const settings = {
    dots: false,
    speed: 800,
    slidesToShow: 6,
    slidesToScroll: 6,
    autoplay: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: (dots: never) => <Box component="ul">{dots}</Box>,
    customPaging: () => (
      <Box
        component={"button"}
        sx={{
          "&:before": {
            color: `${theme.palette.text.disabled} !important`,
          },
        }}
      />
    ),
    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
    ],
  };

  return (
    <Box sx={{ paddingBlock: 10 }}>
      <Container>
        <Box textAlign="center" mb={4}>
          <Typography color="primary" gutterBottom>
            TRUSTED BY BIG PLAYERS
          </Typography>
          {/* <Typography variant="h5">Used by companies like</Typography> */}
        </Box>
        <Box className="slider-container">
          <Slider {...settings}>
            {customers.map((item, index) => (
              <Box key={index}>
                <Box sx={{
                  textAlign: "center",
                  paddingInline: 1,
                  paddingBlock: 2,
                  marginInline: 1,
                  "img": {
                    display: "inline-block",
                  },
                  borderRadius: 2,
                  transitionDuration: '0.3s',
                  "&:hover": {
                    bgcolor: theme.palette.action.hover,
                  }
                }}>
                  <Image
                    src={item.img}
                    alt={item.title}
                    height={40}
                  />
                  <Typography mt={2} sx={{ fontSize: 16 }}>
                    {item.title}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Slider>
        </Box>
      </Container>
    </Box>
  );
}
