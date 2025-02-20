"use client";

import { Box, Tabs, Tab } from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";

interface Props {
  children?: React.ReactElement<unknown>;
}

export default function MdxTabs({ children }: Props) {
  const [value, setValue] = useState<number | undefined>(0);
  const items = Array.isArray(children) ? children : [];

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    const activeIndex = items.findIndex((item) => {
      return item?.props?.default;
    });
    if (activeIndex !== -1) {
      setValue(activeIndex);
    }
  }, []);

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          {items.map((item, index) => {
            return <Tab key={index} label={item?.props?.label} />;
          })}
        </Tabs>
      </Box>
      {items.map((item, index) => {
        return (
          <Box key={index} sx={{ display: value === index ? "block" : "none" }}>
            {item}
          </Box>
        );
      })}
    </>
  );
}
