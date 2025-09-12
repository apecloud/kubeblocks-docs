'use client';

import { Box, BoxProps } from '@mui/material';

interface Props {
  label: string;
  value?: string;
  default?: boolean;
  children?: React.ReactNode;
}

export default function MdxTabItem({
  label,
  value,
  default: isDefault,
  ...props
}: Props & BoxProps) {
  const { children } = props;
  return (
    <Box
      data-default={isDefault}
      data-label={label}
      data-value={value}
      {...props}
      className="tab-item"
    >
      {children}
    </Box>
  );
}
