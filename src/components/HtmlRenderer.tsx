'use client';

import { Box } from '@mui/material';
import 'highlight.js/styles/github-dark.css';

interface HtmlRendererProps {
  content: string;
}

export default function HtmlRenderer({ content }: HtmlRendererProps) {
  return (
    <Box
      className="api-reference-content"
      sx={{
        // Override with-sidebar styles for api-reference pages
        '&': {
          marginRight: '0 !important',
        },
        '& pre': {
          whiteSpace: 'pre',
          overflow: 'auto',
          backgroundColor: '#1e1e1e',
          padding: 2,
          borderRadius: 1,
          position: 'relative',
        },
        '& pre code': {
          whiteSpace: 'pre',
          display: 'block',
          fontFamily: 'monospace',
        },
        '& code': {
          whiteSpace: 'pre',
        },
        '& img': {
          paddingRight: '0 !important',
        },
      }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
