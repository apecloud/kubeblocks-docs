"use client";

import {
  Button,
  ButtonProps,
  CardActionArea,
  CardActionAreaProps,
  ListItemButton,
  ListItemButtonProps,
  Link as MuiLink,
  LinkProps as MuiLinkProps,
} from "@mui/material";
import NextLink, { LinkProps as NextLinkProps } from "next/link";

export type LinkProps = MuiLinkProps & NextLinkProps;

export function Link(props: LinkProps) {
  return <MuiLink {...props} component={NextLink} />;
}

type LinkButtonProps = ButtonProps & LinkProps;
export const LinkButton = (props: LinkButtonProps) => {
  return <Button {...props} component={Link} />;
};

export type LinkCardActionAreaProps = CardActionAreaProps & LinkProps;
export const LinkCardActionArea = (props: LinkCardActionAreaProps) => {
  return <CardActionArea {...props} component={Link} />;
};

export type LinkListItemButtonProps = ListItemButtonProps & LinkProps;
export const LinkListItemButton = (props: LinkListItemButtonProps) => {
  return <ListItemButton {...props} component={Link} />;
};
