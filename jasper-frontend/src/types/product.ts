export type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  basePrice?: number;
  currency?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  images?: Array<{
    id: string;
    url: string;
    alt?: string | null;
    altText?: string | null;
  }>;
  variants?: Array<{
    id: string;
    name: string;
    price?: number | null;
    inventory?: number | null;
  }>;
};
