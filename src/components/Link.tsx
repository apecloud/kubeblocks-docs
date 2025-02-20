"use client";

import { Link as MuiLink, LinkProps as MuiLinkProps } from "@mui/material";
import NextLink, { LinkProps as NextLinkProps } from "next/link";

export function Link(props: MuiLinkProps & NextLinkProps) {
  return (
    <MuiLink
      {...props}
      component={NextLink}
    />
  );
}
