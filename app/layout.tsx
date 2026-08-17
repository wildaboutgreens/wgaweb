import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wild About Greens",
  description: "Fresh microgreens delivered to your door — Chandigarh, Mohali, Panchkula",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
