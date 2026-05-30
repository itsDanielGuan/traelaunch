import localFont from "next/font/local";
import SiteChrome from "@/components/SiteChrome";
import "./globals.css";

const eternalo = localFont({
  src: "../../public/fonts/eternalo.otf",
  variable: "--font-eternalo",
  display: "swap",
});

export const metadata = {
  title: "SAINT CIRCUIT",
  description: "An interactive cinematic pilgrimage powered by PixVerse.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${eternalo.className} ${eternalo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
