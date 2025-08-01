'use client';

import { Box, LinearProgress, styled } from '@mui/material';

const LoaderWrapperStyled = styled(Box)(() => {
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2001,
  };
});

export default function Loading() {
  return (
    <LoaderWrapperStyled>
      <LinearProgress />
    </LoaderWrapperStyled>
  );
}
