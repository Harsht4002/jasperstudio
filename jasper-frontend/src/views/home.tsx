import { ArtisanStory } from "@/components/home/artisan-story";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Hero } from "@/components/home/hero";
import { Newsletter } from "@/components/home/newsletter";
import { SiteLayout } from "@/layouts/site-layout";

export function HomePage() {
  return (
    <SiteLayout>
      <main>
        <Hero />
        <FeaturedCategories />
        <FeaturedProducts />
        <ArtisanStory />
        <Newsletter />
      </main>
    </SiteLayout>
  );
}
