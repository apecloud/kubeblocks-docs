"use client";
import {
  Box,
  Container,
  Divider,
  Grid2 as Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Image from "next/image";

export const Evaluate = ({ playerUrl }: { playerUrl: string }) => {
  const theme = useTheme();

  return (
    <Container sx={{ p: 8, mb: 4 }}>
      <Box mb={20}>
        <Typography variant="h6" gutterBottom>
          Viktor Farcic
        </Typography>
        <Typography color="textSecondary">
          Viktor Farcic is a developer evangelist at Upbound and a Google
          Developer Expert, CDF Ambassador, and member of the Docker Captains
          team. Viktor Farcic is dedicated to promoting the latest DevOps
          technologies and is the host of the YouTube DevOps Toolkit channel.
        </Typography>

        <Divider sx={{ marginBlock: 4 }} />
        <Grid container spacing={8} alignItems="center">
          <Grid size={{ md: 6, sm: 12, xs: 12 }}>
            <iframe
              src={playerUrl}
              style={{
                width: "100%",
                height: "320px",
                borderRadius: "12px",
                // overflow: "hidden",
                border: "none",
              }}
            />
          </Grid>
          <Grid size={{ md: 6, sm: 12, xs: 12 }}>
            <Typography sx={{ fontSize: 16 }}>
              &quot; Whether or not to run a database on Kubernetes is a topic
              that is often discussed. From my perspective, if you&apos;re
              already using containers and don&apos;t want to use a fully
              managed database service, the answer is yes...... KubeBlocks is a
              very unique project that focuses on running multiple databases in
              Kubernetes. It doesn&apos;t necessarily seek to be the best
              solution for a particular database, but rather to be the best
              solution for a wide range of databases. It can be a great fit for
              Kubernetes users who want to migrate their databases to run on
              Kubernetes without wanting to lose control.&quot;
            </Typography>

            <Stack direction="row-reverse" alignItems="center" mt={4} gap={2}>
              <Image
                style={{ borderRadius: 56 }}
                alt="Viktor Farcic"
                width={56}
                height={56}
                src="/site/viktor.png"
              />
              <Box textAlign="right">
                <Typography variant="subtitle2">Viktor Farcic</Typography>
                <Typography color="textSecondary">
                  Developer evangelist @upbound
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Sergy Pronin
        </Typography>
        <Typography color="textSecondary">
          Sergey Pronin is a Product Owner at Percona, focused on delivering
          robust open source databases and cloud-native solutions. Prior to
          joining Percona, Sergey Pronin led product and engineering teams in
          other organizations, with a primary focus on products in the
          infrastructure and platform space.
        </Typography>
        <Divider sx={{ marginBlock: 4 }} />
        <Grid container spacing={8} alignItems="center">
          <Grid size={{ md: 6, sm: 12, xs: 12 }}>
            <Typography sx={{ fontSize: 18 }}>
              &quot;The minor version of KubeBlocks has a very short release
              cycle and is very actively developed...... I strongly believe that
              KubeBlocks&apos; Addon concept and documentation on how to create
              Addon is what makes KubeBlocks have the most contributors......
              KubeBlocks also provides support for AI, such as Xinference and
              MilvusDB, which are part of a modern large model technology
              stack.&quot;
            </Typography>
            <Stack direction="row-reverse" alignItems="center" mt={4} gap={2}>
              <Image
                style={{ borderRadius: 56 }}
                alt="Sergy Pronin"
                width={56}
                height={56}
                src="/site/sergy_pronin.png"
              />
              <Box textAlign="right">
                <Typography variant="subtitle2">Sergy Pronin</Typography>
                <Typography color="textSecondary">
                  Product Owner @Percona
                </Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid size={{ md: 6, sm: 12, xs: 12 }}>
            <Image
              alt="KubeBlocks"
              src={`/site/kb_radar_${theme.palette.mode}.png`}
              width={460}
              height={300}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: 16,
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
