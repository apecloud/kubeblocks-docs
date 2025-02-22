"use client";

import { styled } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";
import { Box, BoxProps } from "@mui/material";

interface LoaderWrapperProps extends BoxProps {
  visible?: boolean;
}

const LoaderWrapperStyled = styled(Box, {
  shouldForwardProp: (prop) => prop !== "visible",
})<LoaderWrapperProps>(({ visible }) => {
  return {
    position: "fixed",
    top: 0,
    left: 0,
    right: 1,
    zIndex: 2001,
    opacity: visible ? 0.8 : 0,
    transition: "opacity 1s",
  };
});

export const TopbarLoader = ({ visible = false }: LoaderWrapperProps) => (
  <LoaderWrapperStyled visible={visible}>
    <LinearProgress />
  </LoaderWrapperStyled>
);
