import { Box } from "@mui/material";
import { NavLink } from "./Link";
import Image from "next/image";

export default function Logo() {
  return (
    <Box>
      <NavLink href="/" style={{ display: "block" }}>
        <Image
          src="/logo.png"
          alt="KubeBlocks"
          width={165}
          height={36}
          style={{ display: "block" }}
        />
      </NavLink>
    </Box>
  );
}
