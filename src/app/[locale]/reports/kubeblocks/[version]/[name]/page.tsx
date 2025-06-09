import path from "path";
import fs from "fs";
import * as cheerio from "cheerio";
import { Box, Divider, Stack, Typography, Button } from "@mui/material";
import { Link } from "@/components/Link";
import { ArrowBack } from "@mui/icons-material";
import { getI18n, getStaticParams } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";

type ParamsType = { name: string; version: string; locale: string };

export async function generateStaticParams() {
  const data: ParamsType[] = [];
  getStaticParams().forEach((item) => {
    const dir = path.join(process.cwd(), "reports", "kubeblocks", item.locale);
    fs.readdirSync(dir).forEach((version) => {
      fs.readdirSync(path.join(dir, version)).forEach((html) => {
        data.push({
          locale: item.locale,
          version,
          name: html.replace(/\.html/, ""),
        });
      });
    });
  });

  return data;
}

export default async function ReportDetail({
  params,
}: {
  params: Promise<ParamsType>;
}) {
  const { name, version, locale } = await params;
  setStaticParamsLocale(locale);

  const t = await getI18n();
  const filename =
    path.join(process.cwd(), "reports", "kubeblocks", locale, version, name) +
    ".html";

  const content = fs.readFileSync(filename);
  const $ = cheerio.load(content);
  $("h1").removeAttr("style");
  $("span").removeAttr("style");
  $("table").removeAttr("style").removeAttr("width");
  $("table td").removeAttr("style");
  $("hr").remove();
  $(".page-break").remove();

  $("td").each(function () {
    const td = $(this);
    if (td.text() === "PASSED") {
      td.css("color", "var(--css-palette-success-main)");
    }
    if (td.text() === "FAILED") {
      td.css("color", "var(--css-palette-error-main)");
    }
    if (td.text() === "SKIPPED") {
      td.css("color", "var(--css-palette-warning-main)");
    }
  });

  const title = $("h1").eq(0).text();
  const team = $("h2").eq(0).text();
  const tester = $("h4").eq(0).text();
  const admin = $("h4").eq(1).text();
  const owner = $("h4").eq(2).text();
  const datetime = $("body > center").first().text();

  const html = $("body > center")
    .first()
    .nextAll()
    .map(function () {
      return $(this).prop("outerHTML");
    })
    .get()
    .join("");

  return (
    <Box>
      <Box sx={{ marginBottom: 4 }}>
        <Button startIcon={<ArrowBack />} component={Link} href="/reports">
          {t("actions.back")}
        </Button>
      </Box>
      <Typography variant="h3" align="center" gutterBottom>
        {title} {version.replace(/-/g, ".")}
      </Typography>
      <Divider>
        <Typography align="center" variant="body2" color="textSecondary">
          {team}
        </Typography>
      </Divider>
      <Stack
        direction="row"
        justifyContent="space-between"
        divider={<Divider orientation="vertical" flexItem />}
        alignItems="center"
        sx={{ marginBlock: 4, paddingInline: 4 }}
      >
        <Box>
          <Typography variant="h6">{t("ReportPage.tester")}</Typography>
          <Typography>{tester}</Typography>
        </Box>
        <Box>
          <Typography variant="h6">{t("ReportPage.admin")}</Typography>
          <Typography>{admin}</Typography>
        </Box>
        <Box>
          <Typography variant="h6">{t("ReportPage.owner")}</Typography>
          <Typography>{owner}</Typography>
        </Box>
      </Stack>

      <Divider sx={{ marginBottom: 8 }} />

      <Box
        className="markdown-body"
        sx={{ marginRight: 0 }}
        dangerouslySetInnerHTML={{ __html: html || "" }}
      />

      <Typography align="center" color="textDisabled" sx={{ marginBlock: 4 }}>
        {datetime}
      </Typography>
    </Box>
  );
}
