'use client';

import { ContentCopy } from '@mui/icons-material';
import { Button, styled, Tooltip, useTheme } from '@mui/material';
import { message } from 'mui-message';
import { JSX, useRef } from 'react';

const StyledCode = styled('code')(() => {
  return {
    '.copy-to-clipboard': {
      display: 'none',
    },
    '&:hover .copy-to-clipboard': {
      display: 'flex',
    },
  };
});

export default function CodeWithCopyButton(
  props: JSX.IntrinsicElements['code'],
) {
  const theme = useTheme();
  const ref = useRef(null);

  const onCopy = async () => {
    const text = (ref.current as unknown as HTMLElement)?.innerText || '';
    if (text) {
      await navigator.clipboard.writeText(text);
      message.success('Copied!');
    }
  };

  if (
    typeof window !== 'undefined' &&
    window.navigator.clipboard === undefined
  ) {
    return <StyledCode {...props}>{props.children}</StyledCode>;
  }

  return (
    <StyledCode {...props} ref={ref}>
      <Tooltip title="Copy" placement="top">
        <Button
          variant="outlined"
          className="copy-to-clipboard"
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            padding: 0.8,
            minWidth: 'auto',
            color: 'rgba(255, 255, 255, 0.5)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            background: '#1A1E22',
            borderWidth: 1,
            '&:hover': {
              borderColor: theme.palette.primary.main,
            },
          }}
          onClick={onCopy}
        >
          <ContentCopy fontSize="small" />
        </Button>
      </Tooltip>
      {props.children}
    </StyledCode>
  );
}
