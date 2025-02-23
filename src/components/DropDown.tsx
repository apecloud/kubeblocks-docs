'use client';

import {
  Box,
  ClickAwayListener,
  Paper,
  Popper,
  PopperPlacementType,
  SxProps,
} from "@mui/material";
import { useRef, useState } from "react";
import { Transitions } from "./Transitions";
import React from "react";

export type DropDownProps = {
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  offset?: number[];
  placement?: PopperPlacementType;
  onChange?: (open: boolean) => void;
  sx?: SxProps;
};
export const DropDown = ({
  children,
  trigger,
  offset,
  placement = "bottom-end",
  onChange = () => {},
  sx
}: DropDownProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const anchorRef = useRef(null);
  return (
    <>
      <Box
        onClick={() => {
          setVisible(true);
          onChange(true);
        }}
        ref={anchorRef}
        sx={{
          display: 'inline-block',
        }}
      >
        {trigger}
      </Box>
      <Popper
        placement={placement}
        open={visible}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset,
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions
            type="grow"
            position="top-right"
            in={open}
            {...TransitionProps}
          >
            <ClickAwayListener onClickAway={() => {
              setVisible(false);
              onChange(false);
            }}>
              <Paper
                role="presentation"
                sx={{
                  ...sx,
                  minWidth: 220,
                }}
              >
                {children}
              </Paper>
            </ClickAwayListener>
          </Transitions>
        )}
      </Popper>
    </>
  );
};
