import type { Metadata } from "next";
import "@/app/styles/globals.css";
import { CartProvider } from "@/store/cart-store";

export const metadata: Metadata = {
  title: "Jasper Studio | Handcrafted Ceramics",
  description: "Handcrafted ceramics, small-batch pottery, and studio vessels made with care.",
  icons: {
    icon: "/images/brand/logo-placeholder.svg",
    shortcut: "/images/brand/logo-placeholder.svg",
    apple: "/images/brand/logo-placeholder.svg",
  }
};


export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}

