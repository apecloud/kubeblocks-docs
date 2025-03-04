"use client";

import { Link } from "@/components/Link";
import { useI18n } from "@/locales/client";
import { MenuItem, Select, Stack, Typography, Chip } from "@mui/material";

type Props = {
  category: string;
  version: string;
  versions: string[];
};
export default function VersionList({ version, versions, category }: Props) {
  const t = useI18n();
  return (
    <Select
      value={version}
      renderValue={(value) => {
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>{t("text.version")}:</Typography>
            <Chip color="primary" size="small" label={value.replace(/_/, '.')} />
          </Stack>
        );
      }}
      sx={{
        boxShadow: "none",
        border: 1,
        borderColor: "divider",
        borderTopWidth: 0,
        borderLeftWidth: 0,
        ".MuiOutlinedInput-notchedOutline": { border: 0 },
        "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
          border: 0,
        },
        "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
          {
            border: 0,
          },
      }}
    >
      {versions.map((v) => (
        <MenuItem
          key={v}
          component={Link}
          href={`/docs/${v}/${category}`}
        >
          {v.replace(/_/, '.')}
        </MenuItem>
      ))}
    </Select>
  );
}
