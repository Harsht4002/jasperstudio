export type CartItemImage = {
  id: string;
  url: string;
  altText: string | null;
};

export type CartItemProduct = {
  id: string;
  name: string;
  slug: string;
  currency: string;
  image: CartItemImage | null;
};

export type CartItemVariant = {
  id: string;
  name: string;
  optionName: string | null;
  optionValue: string | null;
  sku: string | null;
};

export type CartItem = {
  id: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  product: CartItemProduct;
  variant: CartItemVariant;
};

export type Cart = {
  id?: string;
  cartToken?: string | null;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
};

