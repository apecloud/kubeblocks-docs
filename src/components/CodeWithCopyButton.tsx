'use client';

import { ContentCopy } from '@mui/icons-material';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import WrapTextIcon from '@mui/icons-material/WrapText';
import { Box, IconButton, styled, Tooltip } from '@mui/material';
import { message } from 'mui-message';
import { JSX, useRef, useState } from 'react';
const StyledCode = styled('code')(() => {
  return {
    '.code-tools': {
      display: 'none',
    },
    '&:hover .code-tools': {
      display: 'inline-flex',
    },
  };
});

export default function CodeWithCopyButton(
  props: JSX.IntrinsicElements['code'],
) {
  const ref = useRef(null);
  const [breakWord, setBreakWord] = useState<boolean>(false);

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
    <StyledCode
      {...props}
      style={{
        whiteSpace: breakWord ? 'break-spaces' : undefined,
      }}
      ref={ref}
    >
      <Box
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          display: 'flex',
          flexDirection: 'row',
          gap: 1,
        }}
      >
        <Tooltip title="Word break" placement="top" arrow>
          <IconButton
            className="code-tools"
            size="small"
            sx={{
              color: breakWord ? '#FFF' : 'rgba(255, 255, 255, 0.5)',
              background: '#1A1E22',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: 2,
              '&:hover': {
                color: '#FFF',
                background: '#1A1E22',
              },
            }}
            onClick={() => setBreakWord(!breakWord)}
          >
            {breakWord ? (
              <ViewHeadlineIcon sx={{ transform: 'scale(0.8)' }} />
            ) : (
              <WrapTextIcon sx={{ transform: 'scale(0.8)' }} />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip title="Copy" placement="top" arrow>
          <IconButton
            className="code-tools"
            size="small"
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              background: '#1A1E22',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: 2,
              '&:hover': {
                color: '#FFF',
                background: '#1A1E22',
              },
            }}
            color="inherit"
            onClick={onCopy}
          >
            <ContentCopy sx={{ transform: 'scale(0.8)' }} />
          </IconButton>
        </Tooltip>
      </Box>
      {props.children}
    </StyledCode>
  );
}
