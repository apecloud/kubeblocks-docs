'use client';

import { Box, Tab, Tabs } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';

interface Props {
  children?: React.ReactNode;
}

type TabHeader = {
  label: string;
  value: string | null;
  isDefault: boolean | null;
};

export default function MdxTabs({ children }: Props) {
  const [value, setValue] = useState<number | undefined>(0);
  const [tabs, setTabs] = useState<TabHeader[]>([]);
  const items = useMemo(
    () => (Array.isArray(children) ? children : []),
    [children],
  );
  const id = useMemo(() => 'tab-' + Math.ceil(Math.random() * 100000000), []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    const activeIndex = tabs?.findIndex((item) => item.isDefault);
    if (activeIndex !== -1) {
      setValue(activeIndex);
    }
  }, [tabs]);

  useEffect(() => {
    const items = document.querySelectorAll(`#${id} > .tab-wrap > .tab-item`);
    const data: TabHeader[] = [];
    items.forEach((ele) => {
      data.push({
        label: ele.getAttribute('data-label') || '',
        value: ele.getAttribute('data-value'),
        isDefault: ele.getAttribute('data-default') === 'true',
      });
    });
    setTabs(data);
  }, [id]);

  return (
    <Box id={id}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          {tabs?.map((item, index) => {
            return <Tab key={index} label={item.label} />;
          })}
        </Tabs>
      </Box>
      {items?.map((item, index) => {
        return (
          <Box
            className="tab-wrap"
            key={index}
            sx={{ display: value === index ? 'block' : 'none' }}
          >
            {item}
          </Box>
        );
      })}
    </Box>
  );
}
