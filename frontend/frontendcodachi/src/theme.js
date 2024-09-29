// theme.js

import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    samurai: {
      red: "#8B0000",    // Deep Crimson Red
      black: "#0D0D0D",  // Dark Black
      gray: "#333333",   // Charcoal Gray
      steel: "#BCC6CC",  // Light Steel/Silver
      brown: "#4E3629",  // Mahogany Brown
      white: "#FFFFFF",  // Pure White
      indigo: "#1C1E4D", // Deep Indigo/Navy
      gold: "#D4AF37",   // Gold Accent
    },
  },
});

export default theme;
