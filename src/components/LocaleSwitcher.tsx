"use client";
import { Button, ListItemIcon, MenuItem, MenuList } from "@mui/material";
import { useChangeLocale, useCurrentLocale } from "../locales/client";
import { Check } from "@mui/icons-material";
import { DropDown } from "./DropDown";

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
      offset={[0, 16]}
      trigger={
        <Button variant="text" sx={{ width: 80 }}>
          {lang[currentLocale]}
        </Button>
      }
    >
      <MenuList>
        {Object.keys(lang).map((l) => {
          const locale = l as LangType;
          return (
            <MenuItem key={locale} onClick={() => changeLocale(locale)}>
              <ListItemIcon>
                {currentLocale === locale && <Check />}
              </ListItemIcon>
              {lang[locale]}
            </MenuItem>
          );
        })}
      </MenuList>
    </DropDown>
  );
}
