import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NT-OS",
  description: "บริษัท เอ็นที เอาท์ซอร์สซิ่ง เซอร์วิส จำกัด - NTOS",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
