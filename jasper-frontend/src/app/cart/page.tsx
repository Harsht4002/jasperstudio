import { Metadata } from "next";
import { CartPage } from "@/components/cart/cart-page";
import { SiteLayout } from "@/layouts/site-layout";

export const metadata: Metadata = {
  title: "Shopping Cart | Jasper Studio",
  description: "Review handcrafted items in your shopping cart before checkout."
};

export default function Page() {
  return (
    <SiteLayout>
      <CartPage />
    </SiteLayout>
  );
}
