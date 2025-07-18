"use client";
import {
  AddToDriveOutlined,
  AssessmentOutlined,
  AutoModeOutlined,
  BackupOutlined,

  ChatOutlined,
  DatasetLinkedOutlined,
  EnhancedEncryptionOutlined,

  MedicationLiquidOutlined,
  SecurityOutlined,
  TerminalOutlined,

} from "@mui/icons-material";
import {

  Box,

  Container,
  Grid2 as Grid,

  Typography,
  useTheme,
} from "@mui/material";

export default function Features() {
  const theme = useTheme();

  
  const FeatureList = [
    {
      title: "Intuitive CLI",
      icon: <TerminalOutlined color="primary" sx={{ fontSize: 40 }} />,
    },
    {
      title: "Instant Backup",
      icon: <BackupOutlined color="primary" sx={{ fontSize: 40 }} />,
    },
    {
      title: "Point-in-Time Recovery",
      icon: <AddToDriveOutlined color="primary" sx={{ fontSize: 40 }} />,
    },
    {
      title: "Delete Protection",
      icon: <SecurityOutlined color="primary" sx={{ fontSize: 40 }} />,
    },
    {
      title: "Metrics",
      icon: <AssessmentOutlined color="primary" sx={{ fontSize: 40 }} />,
    },
    {
      title: "Logs",
      icon: <ChatOutlined color="primary" sx={{ fontSize: 40 }} />,
    },
    {
      title: "Transport Layer Security",
      icon: (
        <EnhancedEncryptionOutlined color="primary" sx={{ fontSize: 40 }} />
      ),
    },
    {
      title: "Data-at-Rest Encryption",
      icon: <DatasetLinkedOutlined color="primary" sx={{ fontSize: 40 }} />,
    },
    {
      title: "Slow SQL Analysis",
      icon: <MedicationLiquidOutlined color="primary" sx={{ fontSize: 40 }} />,
    },
    {
      title: "Automatic Failure Recovery",
      icon: <AutoModeOutlined color="primary" sx={{ fontSize: 40 }} />,
    },
  ];

  return (
    <Box sx={{ paddingBlock: 16 }}>
      <Container>
        <Box textAlign="center" mb={4}>
          <Typography color="primary" gutterBottom>
            ALMOST COVERED EVERYTHING
          </Typography>
          <Typography variant="h4">
            Other Amazing Features & Flexibility Provided
          </Typography>
        </Box>
        
        <Grid
          container
          textAlign="center"
          sx={{
            "--Grid-borderWidth": "1px",
            borderTop: "1px solid",
            borderLeft: "1px solid",
            borderColor: "divider",
            "& > div": {
              borderRight: "1px solid",
              borderBottom: "1px solid",
              borderColor: "divider",
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
                lg: 3,
              }}
              sx={{
                transition: 'scale 0.2s',
                "&:hover": {
                  background: theme.palette.background.paper,
                  boxShadow: `inset 0 0 0 1px ${theme.palette.primary.main}`,
                  scale: 1.05
                },
                paddingBlock: 3,
                paddingInline: 2,
              }}
            >
              <Box mb={2}>{feature.icon}</Box>
              <Typography color="textSecondary">{feature.title}</Typography>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
