"use client";
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
  position?: string,
  onChange?: (open: boolean) => void;
  sx?: SxProps;
};
export const DropDown = ({
  children,
  trigger,
  offset,
  placement = "bottom-end",
  position = "top",
  onChange = () => {},
  sx,
}: DropDownProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const anchorRef = useRef(null);

  const handleClose = () => {
    setVisible(false);
    onChange(false);
  };

  const handleOpen = () => {
    setVisible(true);
    onChange(true);
  };

  return (
    <>
      <Box
        onClick={handleOpen}
        ref={anchorRef}
        sx={{ display: "inline-block" }}
      >
        {trigger}
      </Box>
      <Popper
        placement={placement}
        open={visible}
        anchorEl={anchorRef.current}
        role={undefined}
        disablePortal
        onClick={handleClose}
        sx={{
          zIndex: 1100
        }}
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
            type="collapse"
            position={position}
            in={open}
            {...TransitionProps}
          >
            <ClickAwayListener onClickAway={handleClose}>
              <Paper
                role="presentation"
                sx={{
                  ...sx,
                  minWidth: 220,
                  boxShadow: "none",
                  border: 1,
                  borderColor: "divider",
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
