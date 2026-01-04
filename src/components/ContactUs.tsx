'use client';

import { Button, ButtonProps } from '@mui/material';

import Link from 'next/link';

export const ContactUs = ({ ...props }: ButtonProps) => {
  return (
    // @ts-expect-error props error
    <Button
      LinkComponent={Link}
      href="https://kubeblocks.com/get-started"
      target="_blank"
      {...props}
    />
  );
};
