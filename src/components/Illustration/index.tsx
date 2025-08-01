'use client';

import { useTheme } from '@mui/material';

import Image from 'next/image';
import emptyDark from './empty-dark.svg';
import empty from './empty.svg';
import errorDark from './error-dark.svg';
import error from './error.svg';
import notfoundDark from './not-found-dark.svg';
import notfound from './not-found.svg';
import usersDark from './users-dark.svg';
import users from './users.svg';

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
  return (
    <Image src={isDark ? dark : light} width={width} height={height} alt="" />
  );
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
