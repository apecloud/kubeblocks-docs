"use client";

import { animateScroll } from 'react-scroll';


import {
  Link as MuiLink,
  LinkProps as MuiLinkProps,
} from "@mui/material";
import NextLink, { LinkProps as NextLinkProps } from "next/link";

export type LinkProps = MuiLinkProps & NextLinkProps;

export function Link(props: LinkProps) {
  return <MuiLink {...props} component={NextLink} onClick={(e) => {
    const anchorId = props.href?.match(/^#/) ? props.href.replace(/^#/, '') : undefined;
    const anchor = anchorId && document.getElementById(anchorId);
    const top = anchor && anchor.offsetTop
    if(top) {
      animateScroll.scrollTo(top - 75, {
        duration: 300,
        smooth: true,
      })
      e.preventDefault();
    }
  }} />;
}