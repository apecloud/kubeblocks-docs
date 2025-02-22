"use client";
import {
  Box,
  Container,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

export default function Footer() {
  const theme = useTheme();
  return (
    <Box
      component="footer"
      sx={{
        padding: 4,
        borderTop: 1,
        borderColor: "divider",
        height: "var(--footer-height)",
        zIndex: "var(--css-zIndex-appBar)",
        background: theme.palette.background.default,
        position: 'relative',
      }}
    >
      <Container>
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          justifyContent="space-between"
        >
          <Box>
            <Typography color="textSecondary">Products</Typography>
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
        </Stack>
        <Typography align="center" mt={8} color="textDisabled">
          © 2024 ApeCloud PTE. Ltd.
        </Typography>
      </Container>
    </Box>
  );
}
