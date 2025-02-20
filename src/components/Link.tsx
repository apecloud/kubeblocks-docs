"use client";

import { Link as MuiLink, LinkProps as MuiLinkProps, useTheme } from "@mui/material";
import NextLink, { LinkProps as NextLinkProps } from "next/link";

type LinkProps = MuiLinkProps & NextLinkProps;

export function Link(props: LinkProps) {
  return <MuiLink {...props} component={NextLink} />;
}

export function NavLink(props: LinkProps) {
  const token = useTheme();
  return <Link {...props} underline="none" sx={{
    color: token.palette.text.primary,
    fontSize: token.typography.fontSize,
    "&:hover": {
      color: token.palette.text.primary,
    }
  }} />;
}
