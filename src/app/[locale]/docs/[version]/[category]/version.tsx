'use client';

import { DropDown } from '@/components/DropDown';
import { Link } from '@/components/Link';
import { useI18n } from '@/locales/client';
import { DoneOutlined, ExpandMore } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  useTheme,
} from '@mui/material';
import _ from 'lodash';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

type Props = {
  version: string;
  versions: string[];
};
export default function VersionList({ version, versions }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const t = useI18n();
  const theme = useTheme();
  const pathnames = usePathname()
    .split('/')
    .filter((item) => !_.includes(['en'], item));

  return (
    <DropDown
      offset={[0, 0]}
      trigger={
        <Box
          sx={{
            borderBottomWidth: 1,
            borderBottomStyle: 'solid',
            borderBottomColor: 'divider',
            paddingBlock: 1,
          }}
        >
          <Button
            color="inherit"
            sx={{
              paddingInline: 2,
              paddingBlock: 1.2,
              bgcolor: open ? theme.palette.action.hover : 'transparent',
              '&:hover': { bgcolor: theme.palette.action.hover },
              borderRadius: 0,
              width: '100%',
              justifyContent: 'space-between',
            }}
            endIcon={
              <ExpandMore
                sx={{
                  transition: 'rotate, 0.3s',
                  transform: open ? 'rotate(-180deg)' : 'rotate(0deg)',
                  scale: 0.6,
                  opacity: 0.8,
                }}
              />
            }
          >
            <Box>
              {t('text.version')}:{' '}
              <Chip
                color="primary"
                size="small"
                label={version.replace(/_/g, '.')}
              />
            </Box>
          </Button>
        </Box>
      }
      sx={{ width: 300 }}
      onChange={(v) => setOpen(v)}
      placement="bottom-start"
    >
      <MenuList>
        {versions.map((v) => {
          pathnames[2] = v;
          return (
            <MenuItem
              key={v}
              dense
              component={Link}
              href={pathnames.join('/')}
              sx={{ paddingBlock: 1.2 }}
            >
              <ListItemIcon>{v === version && <DoneOutlined />}</ListItemIcon>
              <ListItemText>{v.replace(/_/, '.')}</ListItemText>
            </MenuItem>
          );
        })}
      </MenuList>
    </DropDown>
  );

  // return (
  //   <Select
  //     value={version}
  //     renderValue={(value) => {
  //       return (
  //         <Stack direction="row" spacing={1} alignItems="center">
  //           <Typography>{t("text.version")}:</Typography>
  //           <Chip
  //             color="primary"
  //             size="small"
  //             label={value.replace(/_/, ".")}
  //           />
  //         </Stack>
  //       );
  //     }}
  //     MenuProps={{
  //       MenuListProps: {
  //         sx: {},
  //       },
  //       sx: {
  //         boxShadow: 'none'
  //       },
  //     }}
  //     sx={{
  //       boxShadow: "none",
  //       border: 1,
  //       borderColor: "divider",
  //       borderTopWidth: 0,
  //       borderLeftWidth: 0,
  //       ".MuiOutlinedInput-notchedOutline": { border: 0 },
  //       "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
  //         border: 0,
  //       },
  //       "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
  //         {
  //           border: 0,
  //         },
  //     }}
  //   >
  //     <Box>
  //     {versions.map((v) => (
  //       <MenuItem
  //         key={v}
  //         component={Link}
  //         href={`/docs/${v}/${category}`}
  //         sx={{ paddingBlock: 1 }}
  //       >
  //         <ListItemIcon>{v === version && <DoneOutlined />}</ListItemIcon>
  //         <ListItemText>{v.replace(/_/, ".")}</ListItemText>
  //       </MenuItem>
  //     ))}
  //     </Box>
  //   </Select>
  // );
}
