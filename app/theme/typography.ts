// TODO: write documentation about fonts and typography along with guides on how to add custom fonts in own
// markdown file and add links from here

import { Platform } from "react-native"
export const customFontsToLoad = {
  Borsok: require("../../assets/Fonts/Borsok/Borsok.ttf"),
  Poppins: require("../../assets/Fonts/Poppins/Poppins-Regular.ttf"),
  PoppinsLight: require("../../assets/Fonts/Poppins/Poppins-Light.ttf"),
  PoppinsMedium: require("../../assets/Fonts/Poppins/Poppins-Medium.ttf"),
  PoppinsMediumItalic: require("../../assets/Fonts/Poppins/Poppins-MediumItalic.ttf"),
  PoppinsBold: require("../../assets/Fonts/Poppins/Poppins-Bold.ttf"),
  PoppinsBoldItalic: require("../../assets/Fonts/Poppins/Poppins-BoldItalic.ttf"),
  PoppinsExtraBold: require("../../assets/Fonts/Poppins/Poppins-ExtraBold.ttf"),
  PoppinsSemiBold: require("../../assets/Fonts/Poppins/Poppins-SemiBold.ttf"),
}

const fonts = {
  borsok: {
    // Custom font.
    normal: "Borsok",
  },
  poppins: {
    // Custom font.
    light: "PoppinsLight",
    normal: "Poppins",
    medium: "PoppinsMedium",
    mediumItalic: "PoppinsMediumItalic",
    semiBold: "PoppinsSemiBold",
    bold: "PoppinsBold",
    boldItalic: "PoppinsBoldItalic",
    extraBold: "PoppinsExtraBold",
  },
  helveticaNeue: {
    // iOS only font.
    thin: "HelveticaNeue-Thin",
    light: "HelveticaNeue-Light",
    normal: "Helvetica Neue",
    medium: "HelveticaNeue-Medium",
  },
  courier: {
    // iOS only font.
    normal: "Courier",
  },
  sansSerif: {
    // Android only font.
    thin: "sans-serif-thin",
    light: "sans-serif-light",
    normal: "sans-serif",
    medium: "sans-serif-medium",
  },
  monospace: {
    // Android only font.
    normal: "monospace",
  },
}

const fontSizes = {
  h1: 48,
  h2: 34,
  h3: 30,
  h4: 26,
  h5: 20,
  h6: 19,
  body1: 16,
  body2: 14,
  body3: 12,
  body4: 10,
}

const lineHeights = {
  h1: 40,
  h2: 36,
  h3: 32,
  h4: 28,
  h5: 22,
  h6: 21,
  body1: 20,
  body2: 18,
  body3: 16,
  body4: 14,
}

export const typography = {
  /** 
  Basic font sizes and line heights.
  */
  fontSizes,
  lineHeights,
  /**
   * The fonts are available to use, but prefer using the semantic name.
   */
  fonts,
  /**
   * The primary font. Used in most places.
   */
  primary: fonts.poppins,
  /**
   * Like the famous dog poppins in always sunny, a font that never dies.
   */
  Poppins: fonts.poppins,
  /**
   * An alternate font used for perhaps titles and stuff.
   */
  secondary: Platform.select({ ios: fonts.helveticaNeue, android: fonts.sansSerif }),
  /**
   * Lets get fancy with a monospace font!
   */
  code: Platform.select({ ios: fonts.courier, android: fonts.monospace }),

  ResponseCard: {
    fontSize: {
      large: fontSizes.h3,
      medium: fontSizes.h5,
      small: 12,
    },
  },
}
