"use client";

import { Link } from "@/components/Link";
import { ForwardToInboxOutlined } from "@mui/icons-material";
import { Box, Container, Typography, Chip, Stack, Button } from "@mui/material";

export default function Banner() {
  return (
    <Box
      sx={{
        backgroundImage: `url("/site/home-rectangles.svg")`,
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        paddingBlock: 14,
      }}
    >
      <Container>
        <Box textAlign="center">
          <Typography variant="h2" mb={6} sx={{ fontWeight: "bold" }}>
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
          <Typography variant="h6" color="textSecondary" mb={1}>
            KubeBlocks is crafted for managing databases on Kubernetes, designed
            by domain experts with decades of experience.
          </Typography>
          <Typography variant="h6" color="textSecondary" mb={1}>
            It supports a wide range of stateful workloads, including relational
            databases, NoSQL, message queues.
          </Typography>
          <Typography variant="h6" color="textSecondary" mb={1}>
            By streamlining operations, enhancing flexibility, and offering
            extensions, KubeBlocks makes database.
          </Typography>
          <Typography variant="h6" color="textSecondary" mb={2}>
            management easier in cloud-native environments.
          </Typography>

          <Chip
            icon={<ForwardToInboxOutlined sx={{ scale: 0.6 }} />}
            label={
              <Box>
                For technical questions, contact us by &nbsp;
                <Link href="mailto:marcom@apecloud.com" underline="always">Email</Link>
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
              href="https://labs.iximiuz.com/skill-paths/kubeblocks-skill-path-0b16850d"
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
