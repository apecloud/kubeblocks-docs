"use client";

import { Link } from "@/components/Link";
import { ForwardToInboxOutlined } from "@mui/icons-material";
import {
  Box,
  Container,
  Typography,
  Chip,
  Stack,
  Button,
  useTheme,
  alpha,
  darken,
} from "@mui/material";

export default function Banner() {
  const theme = useTheme();
  const isDark = theme.palette.mode.includes("dark");

  const bgDark = {
    backgroundImage: `url("/site/home-rectangles.svg")`,
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    paddingBlock: 14,
  };
  const bgLight = {
    ...bgDark,
    backgroundImage: `url("/site/home-rectangles.svg"), linear-gradient(135deg, ${darken(
      theme.palette.primary.main,
      0.8
    )} 0%, ${darken(theme.palette.primary.main, 0.4)} 100%)`,
  };

  const textColor = '#FFF';
  const textSecondaryColor = alpha(textColor, 0.8);

  return (
    <Box sx={isDark ? bgDark : bgLight}>
      <Container>
        <Box textAlign="center">
          <Typography variant="h2" mb={6} sx={{ fontWeight: "bold", color: textColor }}>
            Run Any &nbsp;
            <Typography
              variant="h2"
              sx={{ fontWeight: "bold" }}
              component="span"
              color="primary"
            >
              Database
            </Typography>
            &nbsp; on Kubernetes
          </Typography>
          <Typography variant="h6" mb={1} sx={{color: textSecondaryColor}}>
            KubeBlocks is crafted for managing databases on Kubernetes, designed
            by domain experts with decades of experience.
          </Typography>
          <Typography variant="h6" mb={1} sx={{color: textSecondaryColor}}>
            It supports a wide range of stateful workloads, including relational
            databases, NoSQL, message queues.
          </Typography>
          <Typography variant="h6" mb={1} sx={{color: textSecondaryColor}}>
            By streamlining operations, enhancing flexibility, and offering
            extensions, KubeBlocks makes database.
          </Typography>
          <Typography variant="h6" mb={2} sx={{color: textSecondaryColor}}>
            management easier in cloud-native environments.
          </Typography>

          <Chip
            icon={<ForwardToInboxOutlined color="disabled" sx={{ scale: 0.6, color: textColor }} />}
            sx={{ color: textColor, background: "rgba(255, 255, 255, 0.1)", }}
            label={
              <Box>
                For technical questions, contact us by &nbsp;
                <Link href="mailto:marcom@apecloud.com" underline="always">
                  Email
                </Link>
              </Box>
            }
          />

          <Stack
            direction="row"
            spacing={4}
            alignItems="center"
            justifyContent="center"
            mt={8}
            mb={2}
          >
            <Button
              component={Link}
              variant="contained"
              href="/docs/preview/user_docs"
              size="large"
              sx={{
                paddingInline: 4,
                paddingBlock: 1.5,
                fontWeight: "bold",
              }}
            >
              Documentation
            </Button>
            <Button
              variant="outlined"
              component={Link}
              href="https://labs.iximiuz.com/skill-paths/kubeblocks-skill-path-1f1a0a29"
              size="large"
              target="_blank"
              sx={{
                paddingInline: 4,
                paddingBlock: 1.5,
              }}
            >
              Try KubeBlocks Online
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
