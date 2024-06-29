import { Inter, Roboto, Questrial } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const questrial = Questrial({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});
