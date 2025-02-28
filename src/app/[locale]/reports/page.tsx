import path from "path";
import fs from "fs";

import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Grid2 as Grid,
  Chip,
} from "@mui/material";

import * as cheerio from "cheerio";
import { Link } from "@/components/Link";
import Banner from "./banner";

export default async function ReportsList({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const REPORTS_DIR = path.join(process.cwd(), "reports", "kubeblocks", locale);
  const versions: string[] = fs.readdirSync(REPORTS_DIR);

  const reports: {
    url: string;
    title: string;
    datetime: string;
    version: string;
    tester: string;
    owner: string;
  }[] = [];

  versions.forEach((version) =>
    fs
      .readdirSync(path.join(REPORTS_DIR, version))
      .filter((file) => file.match(/\.html$/))
      .forEach((file) => {
        const name = file.replace(/\.html$/, "");
        const content = String(
          fs.readFileSync(path.join(REPORTS_DIR, version, file))
        );
        const $ = cheerio.load(content);
        reports.push({
          url: `/reports/kubeblocks/${version}/${name}`,
          title: $("h1").eq(0).text(),
          version,
          tester: $("h4").eq(0).text(),
          owner: $("h4").eq(1).text(),
          datetime: $("body > center").first().text(),
        });
      })
  );

  return (
    <>
      <Banner />
      <Grid container spacing={3}>
        {reports.map((report, reportIndex) => (
          <Grid
            key={reportIndex}
            size={{
              xs: 12,
              sm: 12,
              md: 6,
            }}
          >
            <Card
              sx={{
                position: "relative",
                boxShadow: "none",
                border: "1px solid var(--css-palette-divider)",
              }}
            >
              <Chip
                label={report.version.replace(/-/g, '.')}
                color="primary"
                size="small"
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  borderRadius: 1,
                  fontWeight: "bold",
                  fontSize: '1em'
                }}
              />
              <CardActionArea
                component={Link}
                href={report.url}
                underline="none"
              >
                <CardContent
                  sx={{
                    padding: 4,
                  }}
                >
                  <Typography
                    variant="h6"
                    mb={2}
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {report.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    {report.owner}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    {report.tester}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    {report.datetime}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
