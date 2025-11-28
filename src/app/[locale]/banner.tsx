'use client';

import { Link } from '@/components/Link';
import { ForwardToInboxOutlined } from '@mui/icons-material';
import {
  alpha,
  Box,
  Button,
  Chip,
  Container,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';

export default function Banner() {
  const theme = useTheme();
  const isDark = theme.palette.mode.includes('dark');

  const bgDark = {
    backgroundImage: `url("/site/home-rectangles.svg")`,
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    paddingBlock: 14,
  };
  const bgLight = {
    ...bgDark,
    backgroundImage: `url("/site/home-rectangles.svg"), linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.9) 100%)`,
  };

  const textColor = '#FFF';
  const textSecondaryColor = alpha(textColor, 0.8);

  return (
    <Box sx={isDark ? bgDark : bgLight}>
      <Container>
        <Box textAlign="center">
          <Typography
            variant="h2"
            mb={6}
            ml="auto"
            mr="auto"
            sx={{ fontWeight: 'bold', color: textColor, maxWidth: 1000 }}
          >
            The Unified &nbsp;
            <Typography
              variant="h2"
              sx={{ fontWeight: 'bold' }}
              component="span"
              color="primary"
            >
              Database Operator
            </Typography>
            &nbsp; for Kubernetes
          </Typography>
          <Typography mb={8} sx={{ color: textSecondaryColor, fontSize: 22 }}>
            Stop juggling multiple operators. KubeBlocks provides a single,
            production-grade control plane to run, manage, and scale any
            database—from MySQL and PostgreSQL to Kafka and MongoDB—with a
            unified API.
          </Typography>

          <Chip
            icon={
              <ForwardToInboxOutlined
                color="disabled"
                sx={{ scale: 0.6, color: textColor }}
              />
            }
            sx={{ color: textColor, background: 'rgba(255, 255, 255, 0.1)' }}
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
                fontWeight: 'bold',
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
