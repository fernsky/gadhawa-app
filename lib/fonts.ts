// import { JetBrains_Mono as FontMono, Inter as FontSans } from "next/font/google"

// export const fontSans = FontSans({
//   subsets: ["latin"],
//   variable: "--font-sans",
// })

// export const fontMono = FontMono({
//   subsets: ["latin"],
//   variable: "--font-mono",
// })

export const fonts = {
  regular: { fontFamily: "Inter" },
  light: { fontFamily: "Inter-Light" },
  medium: { fontFamily: "Inter-Medium" },
  semiBold: { fontFamily: "Inter-SemiBold" },
  bold: { fontFamily: "Inter-Bold" },
  black: { fontFamily: "InterBlack" },
} as const;
