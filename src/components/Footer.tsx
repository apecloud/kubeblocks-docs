"use client";
import {
  Box,
  Container,
  Typography,
  useTheme,
} from "@mui/material";

export default function Footer({
  border = true
}: {
  border?: boolean
}) {
  const theme = useTheme();
  return (
    <Box
      component="footer"
      sx={{
        padding: 4,
        borderTop: border ? 1 : 0,
        borderColor: "divider",
        background: theme.palette.background.default,
      }}
    >
      <Container>
        {/* <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h6" gutterBottom>Products</Typography>
            <Link href="https://kubeblocks.io" variant="body2" underline="hover" color="textSecondary">KubeBlocks</Link>
          </Box>
          <Box>
            <Typography color="textSecondary">Resources</Typography>
          </Box>
          <Box>
            <Typography color="textSecondary">Company</Typography>
          </Box>
          <Box>
            <Typography color="textSecondary">Contact us</Typography>
          </Box>
        </Stack> */}
        <Typography align="center" color="textDisabled">
          © {(new Date()).getFullYear()} ApeCloud PTE. Ltd.
        </Typography>
      </Container>
    </Box>
  );
}
