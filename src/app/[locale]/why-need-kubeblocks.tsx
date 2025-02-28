"use client";
import {
  CableOutlined,
  Diversity2Outlined,
  ExtensionOutlined,
  HubOutlined,
  NetworkCheckOutlined,
  WebhookOutlined,
} from "@mui/icons-material";
import { Avatar, Stack } from "@mui/material";

import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";

const mainData = [
  {
    title: "High Availability",
    icon: <NetworkCheckOutlined sx={{ color: "#FFF" }} />,
    description:
      "KubeBlocks provides a decentralized, Kubernetes-native high availability architecture, perfect for managing large-scale database clusters, particularly MySQL and Redis primary-replica clusters. Its design enhances fault tolerance. Additionally, its lightweight nature reduces resource strain, boosting overall efficiency. This makes KubeBlocks highly effective for handling extensive database clusters.",
  },
  {
    title: "Flexible Cluster Topology",
    icon: <HubOutlined sx={{ color: "#FFF" }} />,
    description:
      "KubeBlocks' modular design allows you to customize cluster topologies according to your needs. This flexibility lets you create database clusters tailored to specific requirements, enhancing system adaptability and functionality. For instance, when creating a Redis cluster, you can choose from single-node, primary-replica, and Redis Cluster topologies, and configure them with your preferred proxy components.",
  },
  {
    title: "Versatile Network Modes",
    icon: <Diversity2Outlined sx={{ color: "#FFF" }} />,
    description:
      "KubeBlocks offers multiple network modes, allowing you to select network configurations when creating database clusters. For example, MongoDB can be launched using host or container network modes. This flexibility ensures efficient communication and performance optimization across various environments, adapting to complex network architectures and requirements.",
  },
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
        paddingBlock: 10,
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

        <Stack mb={4} spacing={3}>
          {mainData.map((item, index) => (
            <Card
              key={index}
              sx={{
                borderRadius: 2,
                padding: 2,
                border: 1,
                borderColor: "divider",
                boxShadow: `none`,
                background: "none",
                "&:hover": {
                  background: theme.palette.background.paper,
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
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
