"use client";

import {
  Box,
  Button,
  Grid2 as Grid,
  ListItemText,
  MenuItem,
  Stack,
  useTheme,
} from "@mui/material";
import { useI18n } from "@/locales/client";
import { ExpandMore } from "@mui/icons-material";
import { useState } from "react";
import { Link } from "@/components/Link";
import { DropDown } from "@/components/DropDown";
import { ApeCloudMySQLIcon, ElasticSearchIcon, KafkaIcon, MilvusIcon, MongodbIcon, MySQLIcon, PostgreSQLIcon, PulsarIcon, QdrantIcon, RabbitMQIcon, StarRocksIcon } from "@/components/icons";


export default function DatabasesNav() {
  const [open, setOpen] = useState<boolean>(false);
  const t = useI18n();
  const theme = useTheme();

  const iconProps = { sx: { fontSize: 30 }}

  const databases = [
    {
      title: "ApeCloud MySQL",
      icon: <ApeCloudMySQLIcon {...iconProps} />,
      href: "/docs/preview/kubeblocks-for-apecloud-mysql",
    },
    {
      title: "MySQL Community Edition",
      icon: <MySQLIcon {...iconProps}/>,
      href: "/docs/preview/kubeblocks-for-mysql-community-edition",
    },
    {
      title: "Kafka",
      icon: <KafkaIcon {...iconProps}/>,
      href: "/docs/preview/kubeblocks-for-kafka",
    },
    {
      title: "Milvus",
      icon: <MilvusIcon {...iconProps}/>,
      href: "/docs/preview/kubeblocks-for-milvus",
    },
    {
      title: "MongoDB",
      icon: <MongodbIcon {...iconProps}/>,
      href: "/docs/preview/kubeblocks-for-mongodb",
    },
    {
      title: "PostgreSQL",
      icon: <PostgreSQLIcon {...iconProps}/>,
      href: "/docs/preview/kubeblocks-for-postgresql",
    },
    {
      title: "Pulsar",
      icon: <PulsarIcon {...iconProps}/>,
      href: "/docs/preview/kubeblocks-for-pulsar",
    },
    {
      title: "Qdrant",
      icon: <QdrantIcon {...iconProps}/>,
      href: "/docs/preview/kubeblocks-for-qdrant",
    },
    {
      title: "RabbitMQ",
      icon: <RabbitMQIcon {...iconProps}/>,
      href: "/docs/preview/kubeblocks-for-rabbitmq",
    },
    {
      title: "StarRocks",
      icon: <StarRocksIcon {...iconProps}/>,
      href: "/docs/preview/kubeblocks-for-starrocks",
    },
    {
      title: "ElasticSearch",
      icon: <ElasticSearchIcon {...iconProps}/>,
      href: "/docs/preview/kubeblocks-for-elasticsearch",
    },
  ];

  return (
    <DropDown
      offset={[0, 13]}
      trigger={
        <Button
          color="inherit"
          size="large"
          sx={{
            paddingInline: 2,
            bgcolor: open ? theme.palette.action.hover : "transparent",
            "&:hover": { bgcolor: theme.palette.action.hover },
          }}
          endIcon={
            <ExpandMore
              sx={{
                transition: "rotate, 0.3s",
                transform: open ? "rotate(-180deg)" : "rotate(0deg)",
                scale: 0.6,
                opacity: 0.8,
              }}
            />
          }
        >
          {t("navigation.databases")}
        </Button>
      }
      onChange={(v) => setOpen(v)}
      sx={{ width: 760 }}
      placement="bottom-start"
    >
      <Box p={1.5}>
        <Grid container spacing={1}>
          {databases.map((item, index) => (
            <Grid size={4} key={index}>
              <MenuItem
                dense
                component={Link}
                href={item.href}
                sx={{ borderRadius: 1 }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  {item.icon}
                  <ListItemText>{item.title}</ListItemText>
                </Stack>
              </MenuItem>
            </Grid>
          ))}
        </Grid>
      </Box>
    </DropDown>
  );
}
