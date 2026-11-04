"use client";

import type { ReactNode } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { thTH } from "@mui/x-date-pickers/locales";
import "dayjs/locale/th";

const theme = createTheme({
  typography: { fontFamily: "var(--font-anuphan), ui-sans-serif, system-ui, sans-serif" },
  palette: { primary: { main: "#171717" }, text: { primary: "#171717", secondary: "#737373" } },
  shape: { borderRadius: 10 },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: { borderColor: "#e5e5e5" },
      },
    },
    MuiMenuItem: { styleOverrides: { root: { fontSize: 14 } } },
  },
});

export default function MuiProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale="th"
        localeText={thTH.components.MuiLocalizationProvider.defaultProps.localeText}
      >
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  );
}
