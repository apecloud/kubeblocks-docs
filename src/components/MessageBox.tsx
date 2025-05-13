"use client";

import { MessageBox as MuiMessageBox } from "mui-message";

export default function MessageBox() {
  return (
    <MuiMessageBox
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    />
  );
}
