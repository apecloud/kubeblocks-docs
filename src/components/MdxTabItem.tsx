'use client';

import { Box, BoxProps } from '@mui/material';

interface Props {
  label: string;
  children?: React.ReactNode;
}

export default function MdxTabItem(props: Props & BoxProps) {
  const { children } = props;
  return <Box {...props}>{children}</Box>;
}
