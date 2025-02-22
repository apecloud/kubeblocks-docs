"use client";

import { KeyboardArrowUp } from "@mui/icons-material";
import { Box, Fab, Fade, useScrollTrigger } from "@mui/material";
import { animateScroll } from "react-scroll";
interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

export default function ScrollTop(props: Props) {
  const { window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  return (
    <Fade in={trigger}>
      <Box
        onClick={() =>
          animateScroll.scrollToTop({
            duration: 300,
          })
        }
        role="presentation"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        <Fab color="primary">
          <KeyboardArrowUp />
        </Fab>
      </Box>
    </Fade>
  );
}
