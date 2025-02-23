import { Box } from "@mui/material";
import Image from "next/image";
import { Link } from "./Link";

export default function Logo() {
  return (
    <Box>
      <Link href="/" style={{ display: "block" }} underline="none" color="textPrimary">
        <Image
          src="/logo.png"
          alt="KubeBlocks"
          width={165}
          height={36}
          style={{ display: "block" }}
        />
      </Link>
    </Box>
  );
}
