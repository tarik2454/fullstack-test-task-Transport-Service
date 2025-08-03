import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@ant-design/v5-patch-for-react-19";
import "../globals.css";

const interFont = Inter({ variable: "--font-inter", subsets: ["latin"] });
const robotoMonoFont = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Transport Service",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interFont.variable} ${robotoMonoFont.variable} antialiased`}
      >
        <main>
          <AntdRegistry>{children}</AntdRegistry>
        </main>
      </body>
    </html>
  );
}
