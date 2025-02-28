"use client";

import { useScopedI18n } from "@/locales/client";
import { Box, Typography, useTheme } from "@mui/material";

export default function Banner() {
  const theme = useTheme();
  const t = useScopedI18n('ReportPage');
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.main,
        marginBottom: 4,
        borderRadius: 2,
        backgroundImage: 'url("/site/home-rectangles.svg")',
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover",
        position: "relative",
        overflow: "hidden",
        "&:before": {
          content: '" "',
          position: "absolute",
          width: 200,
          height: 200,
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          top: "-30%",
          right: -20,
        },
        "&:after": {
          content: '" "',
          position: "absolute",
          width: 100,
          height: 100,
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          top: -30,
          right: 140,
        },
        paddingInline: 4,
        paddingBlock: 4,
      }}
    >
      <Typography variant="h4" sx={{ color: "#FFF" }}>
        {t("report")}
      </Typography>
    </Box>
  );
}
