"use client";
import {
  CableOutlined,
  ExtensionOutlined,
  WebhookOutlined,
} from "@mui/icons-material";
import { alpha, Avatar, Stack } from "@mui/material";

import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";

const data = [
  {
    title: "Beyond StatefulSet",
    icon: <WebhookOutlined sx={{ color: "#FFF" }} />,
    description: `KubeBlocks introduces InstanceSet, an improved StatefulSet that
                manages databases in a specific role order to enhance
                availability. Besides, InstanceSet supports heterogeneous
                replicas with varied resources and configurations, allows
                in-place Pod updates, and takes individual database instances
                offline for proactive maintenance.`,
  },
  {
    title: "Unified API",
    icon: <CableOutlined sx={{ color: "#FFF" }} />,
    description: `KubeBlocks provides a unified API for operating and managing
                different types of databases, significantly reducing the
                complexity and learning curve associated with database
                management. This standardized approach ensures that
                administrators can efficiently interact with various database
                systems in the same way, streamlining operations and improving
                productivity.`,
  },
  {
    title: "Extensible Addon",
    icon: <ExtensionOutlined sx={{ color: "#FFF" }} />,
    description: `KubeBlocks' standardized API design provides robust
                extensibility, enabling low-code integration for both in-house
                and open-source databases. This approach eliminates the need for
                extensive custom Golang coding, turns your database knowledge
                into productivity efficiently, and significantly speeds up
                development times. KubeBlocks currently supports over 40
                database engines. Welcome to join our community.`,
  },
];

export default function WhyNeedKubeBlocks() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        paddingBlock: 8,
        background: alpha(theme.palette.background.paper, 0.2),
      }}
    >
      <Container>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" mb={2}>
            Why you need KubeBlocks
          </Typography>
          <Typography variant="h5" color="textSecondary">
            Run Databases on Kubernetes? Run with KubeBlocks.
          </Typography>
        </Box>
        <Stack spacing={4}>
          {data.map((item, index) => (
            <Card
              key={index}
              sx={{
                borderRadius: 2,
                padding: 2,
                border: 1,
                borderColor: 'divider',
                boxShadow: `none`,
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <Avatar
                    variant="rounded"
                    sx={{ bgcolor: theme.palette.primary.main }}
                  >
                    {item.icon}
                  </Avatar>
                  <Typography variant="h5">{item.title}</Typography>
                </Stack>
                <Typography color="textSecondary">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
