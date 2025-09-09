'use client';

import { Box, Card, CardContent, Tab, Tabs } from '@mui/material';
import mermaid from 'mermaid';
import { useTheme } from 'next-themes';
import panzoom from 'panzoom';
import { useCallback, useEffect, useRef, useState } from 'react';
import './chart-mermaid.css';

export const ChartMermaid = ({ children }: { children: string }) => {
  const [svg, setSvg] = useState('');
  const { resolvedTheme } = useTheme();
  const [error, setError] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [id, setId] = useState<string>();

  const [tab, setTab] = useState<number>(0);

  const renderMermaid = useCallback(async () => {
    const isDark = resolvedTheme === 'dark';

    try {
      mermaid.initialize({
        startOnLoad: true,
        theme: isDark ? 'dark' : 'neutral',
        securityLevel: 'loose',
        themeVariables: {
          // primaryColor: 'var(--css-palette-primary-main)',
          // primaryTextColor: '#fff',
          fontSize: 'inherit',
          labelBkg: 'transparent',
          lineColor: 'var(--css-palette-divider)',

          // Flowchart Variables
          nodeBorder: 'var(--css-palette-divider)',
          clusterBkg: 'var(--css-palette-background-paper)',
          clusterBorder: 'var(--css-palette-divider)',
          defaultLinkColor: 'var(--css-palette-divider)',
          edgeLabelBackground: 'transparent',
          // titleColor: 'var(--muted-foreground)',
          // nodeTextColor: 'var(--card-foreground)',
        },
        themeCSS: '.labelBkg { background: none; }',
        flowchart: {},
      });
      const { svg } = await mermaid.render(`mermaid-container-${id}`, children);
      setSvg(svg);
      setError(false);
    } catch (err) {
      console.log(err);
      setError(true);
    }
  }, [children, id, resolvedTheme]);

  useEffect(() => {
    renderMermaid();
  }, [renderMermaid]);

  useEffect(() => {
    setId(String((Math.random() * 100000).toFixed(0)));
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      panzoom(containerRef.current, {
        minZoom: 0.5,
        maxZoom: 5,
      });
    }
  }, []);

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tab}
          onChange={(event, v) => {
            setTab(v);
          }}
        >
          <Tab label="Graph" />
          <Tab label="Data" />
        </Tabs>
      </Box>
      <Card
        sx={{
          marginBlock: 2,
          overflow: 'hidden',
          display: tab === 0 ? 'block' : 'none',
        }}
        variant="outlined"
      >
        <CardContent
          sx={{
            minHeight: 320,
            cursor: 'move',
          }}
        >
          <div
            ref={containerRef}
            data-error={error}
            className={`mermaid-container-${id} flex justify-center`}
            dangerouslySetInnerHTML={{
              __html: svg,
            }}
          />
        </CardContent>
      </Card>
      <div
        style={{
          display: tab === 1 ? 'block' : 'none',
        }}
      >
        <code
          className="hljs language-mermaid"
          style={{
            marginBlock: 16,
          }}
        >
          {children}
        </code>
      </div>
    </>
  );
};
