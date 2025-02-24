"use client";

import {
  Link as MuiLink,
  LinkProps as MuiLinkProps,
} from "@mui/material";
import NextLink, { LinkProps as NextLinkProps } from "next/link";

export type LinkProps = MuiLinkProps & NextLinkProps;

export function Link(props: LinkProps) {
  return <MuiLink {...props} component={NextLink} />;
}