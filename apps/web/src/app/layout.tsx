import "./styles.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Parent Assist Viewer",
  description: "View a live help session."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
