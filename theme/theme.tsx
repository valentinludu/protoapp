"use client";
import { extendTheme } from "@mui/material/styles";
import { roboto } from "@/app/fonts";
import { primaryTextColor, primaryTextColorDarkMode } from "./colors";

const theme = extendTheme({
  cssVarPrefix: "proto",
  typography: {
    ...roboto.style,
  },
  colorSchemes: {
    light: {
      palette: {
        // action: {
        //   focus: "rgb(29, 92, 132, 0.1)",
        //   hover: "rgba(22, 52, 71, 0.07)",
        //   selected: "rgba(22, 52, 71, 0.07)",
        // },
        // background: {
        //   default: "#fff",
        //   paper: "#fff",
        // },
        text: {
          disabled: primaryTextColor,
          primary: primaryTextColor,
        },
        // primary: {
        //   main: blueColor,
        // },
        // secondary: {
        //   main: secondaryTextColor,
        // },
      },
    },
    dark: {
      // palette for dark mode
      palette: {
        // action: {
        //   focus: "rgb(29, 92, 132)",
        //   hover: "rgba(255, 255, 255, 0.055)",
        //   selected: "rgba(255, 255, 255, 0.055)",
        // },
        // background: {
        //   default: backgroundColorDarkMode,
        //   paper: backgroundLightColorDarkMode,
        // },
        text: {
          disabled: primaryTextColorDarkMode,
          primary: primaryTextColorDarkMode,
        },
        // primary: {
        //   main: darkBlueColor,
        //   dark: darken(darkBlueColor, 0.2),
        // },
        // secondary: {
        //   main: secondaryTextColorDarkMode,
        // },
      },
    },
  },
  components: {
    MuiAvatar: {
      styleOverrides: {
        root: () => ({
          fontWeight: 500,
        }),
      },
    },
    MuiAutocomplete: {
      defaultProps: {
        blurOnSelect: "touch",
      },
      styleOverrides: {
        popper: {
          zIndex: "1050",
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButtonGroup: {
      defaultProps: {
        disableRipple: true,
        disableElevation: true,
      },
      styleOverrides: {
        groupedContained: {
          "&:not(:last-child)": {
            borderRightColor: "rgba(0, 0, 0 / 0.2)",
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
        disableElevation: true,
      },
      styleOverrides: {
        // outlined: {
        //   color: "#000",
        // },
        outlined: {
          fontWeight: 400,
        },
        root: {
          textTransform: "none",
          borderColor: "divider",
        },
        text: ({ theme, variant, color }) => ({
          "&:hover": {
            backgroundColor: theme.vars.palette.background.paper,
          },
          color: color || theme.vars.palette.text.primary,
        }),
      },
    },
    MuiIconButton: {
      defaultProps: {
        color: "inherit", // set to inherit, the default is rgba (0,0,0, .54) which makes icons half-opaque
      },
    },
    MuiMenuItem: {
      defaultProps: {
        dense: true,
      },
    },
    MuiTypography: {
      defaultProps: {
        color: "text.primary",
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
        enterDelay: 1000,
        placement: "top",
      },
    },
    MuiCard: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiCardContent: {},
    MuiCssBaseline: {},
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          fontSize: "inherit",
        },
      },
    },
    MuiInput: {
      defaultProps: {
        size: "small",
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          transform: "scale(1, 1)",
        },
      },
    },
    MuiOutlinedInput: {
      defaultProps: {
        size: "small",
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0,
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        size: "small",
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 0,
          textTransform: "none",
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: "none",
      },
    },
  },
});

export default theme;
