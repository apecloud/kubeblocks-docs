"use client";

import { Box } from "@mui/material";

interface Props {
  children?: React.ReactElement<unknown>;
}

export default function MdxTabItem(props: Props) {
  const { children } = props;
  return <Box>{children}</Box>;
}
