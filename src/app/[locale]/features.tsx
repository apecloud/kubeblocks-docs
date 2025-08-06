'use client';
import {
  AddToDriveOutlined,
  AssessmentOutlined,
  AutoModeOutlined,
  BackupOutlined,
  DatasetLinkedOutlined,
  EnhancedEncryptionOutlined,
  MedicationLiquidOutlined,
  SecurityOutlined,
  TerminalOutlined,
} from '@mui/icons-material';
import { Box, Container, Grid2 as Grid, Stack, Typography } from '@mui/material';
import React from 'react';

export default function Features() {
  const FeatureList = [
    {
      title: 'Intuitive CLI',
      icon: TerminalOutlined,
      description: "Streamline operations with a user-friendly command-line interface for effortless database management."
    },
    {
      title: 'Instant Backup',
      icon: BackupOutlined,
      description: "Safeguard your data with rapid, reliable backup capabilities."
    },
    {
      title: 'Point-in-Time Recovery (PITR) ',
      icon: AddToDriveOutlined,
      description: "Restore databases to any specific moment with precision."
    },
    {
      title: 'Delete Protection',
      icon: SecurityOutlined,
      description: "Prevent accidental data loss with built-in safeguards."
    },
    {
      title: 'Metrics & Logs',
      icon: AssessmentOutlined,
      description: "Gain deep visibility with comprehensive monitoring and logging."
    },
    {
      title: 'Transport Layer Security (TLS)',
      icon: EnhancedEncryptionOutlined,
      description: "Ensure secure data transmission with robust encryption."
    },
    {
      title: 'Data-at-Rest Encryption',
      icon: DatasetLinkedOutlined,
      description: "Protect sensitive information with encrypted storage."
    },
    {
      title: 'Slow SQL Analysis',
      icon: MedicationLiquidOutlined,
      description: "Identify and optimize inefficient queries for peak performance."
    },
    {
      title: 'Automatic Failure Recovery',
      icon: AutoModeOutlined,
      description: "Minimize downtime with self-healing capabilities."
    },
  ];

  return (
    <Box sx={{ paddingBlock: 12 }} mb={8}>
      <Container>
        <Box textAlign="center" mb={8}>
          <Typography variant="h3" mb={2}>
            Key Features & Benefits
          </Typography>
          <Typography variant='h6' color="textSecondary">
            KubeBlocks empowers DevOps and DBAs with a unified, scalable, and secure database operations experience on Kubernetes.
          </Typography>
        </Box>

        <Grid
          container

          sx={{
            '--Grid-borderWidth': '1px',
            borderTop: '1px solid',
            borderLeft: '1px solid',
            borderColor: 'divider',
            '& > div': {
              borderRight: '1px solid',
              borderBottom: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          {FeatureList.map((feature, index) => (
            <Grid
              key={index}
              size={{
                xs: 12,
                sm: 6,
                md: 4,
              }}
              sx={{
                paddingBlock: 3,
                paddingInline: 2,
              }}
            >
              <Stack direction="row" mb={2} alignItems="center" spacing={1}>
                {React.createElement(feature.icon, { sx: {fontSize: '1rem'} })}
                <Typography variant='h6'>{feature.title}</Typography>
              </Stack>
              <Typography color="textSecondary">{feature.description}</Typography>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
