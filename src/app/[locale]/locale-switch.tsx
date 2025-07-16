"use client";
import { IconButton, ListItemIcon, ListItemText, MenuItem, MenuList } from "@mui/material";

import { Check, Language } from "@mui/icons-material";
import { useChangeLocale, useCurrentLocale } from "@/locales/client";
import { DropDown } from "@/components/DropDown";


type LangType = "en" | "zh";

const lang: {
  [key in LangType]: string;
} = {
  en: "English",
  zh: "简体中文",
} as const;

export default function LocaleSwitcher() {
  const currentLocale = useCurrentLocale();
  const changeLocale = useChangeLocale();

  return (
    <DropDown
      offset={[0, 14]}
      trigger={
        <IconButton>
          <Language />
        </IconButton>
      }
    >
      <MenuList dense>
        {Object.keys(lang).map((l) => {
          const locale = l as LangType;
          return (
            <MenuItem key={locale} onClick={() => changeLocale(locale)} sx={{ paddingBlock: 1.2 }}>
              <ListItemIcon>
                <Check sx={{ visibility: currentLocale === locale ? "visible" : "hidden" }} />
              </ListItemIcon>
              <ListItemText>{lang[locale]}</ListItemText>
            </MenuItem>
          );
        })}
      </MenuList>
    </DropDown>
  );
}
