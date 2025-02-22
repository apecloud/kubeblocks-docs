"use client";

import { useTheme } from "@mui/material";

import notfound from "./not-found.svg";
import notfoundDark from "./not-found-dark.svg";
import error from "./error.svg";
import errorDark from "./error-dark.svg";
import users from "./users.svg";
import usersDark from "./users-dark.svg";
import empty from "./empty.svg";
import emptyDark from "./empty-dark.svg";
import Image from "next/image";

export type IllustrationProps = {
  width?: number;
  height?: number;
};

export type IllustrationBaseProps = IllustrationProps & {
  light: string;
  dark: string;
};

export const IllustrationBase = ({
  width = 300,
  height,
  light,
  dark,
}: IllustrationBaseProps) => {
  const theme = useTheme();
  const isDark = new RegExp(/dark/).test(theme.palette.mode);
  return <Image src={isDark ? dark : light} width={width} height={height} alt="" />;
};

export const IllustrationNotFound = (props: IllustrationProps) => (
  <IllustrationBase {...props} light={notfound} dark={notfoundDark} />
);

export const IllustrationError = (props: IllustrationProps) => (
  <IllustrationBase {...props} light={error} dark={errorDark} />
);

export const IllustrationUsers = (props: IllustrationProps) => (
  <IllustrationBase {...props} light={users} dark={usersDark} />
);

export const IllustrationEmpty = (props: IllustrationProps) => (
  <IllustrationBase {...props} light={empty} dark={emptyDark} />
);
