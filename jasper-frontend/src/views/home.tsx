import { ArtisanStory } from "@/components/home/artisan-story";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Hero } from "@/components/home/hero";
import { IntroWelcome } from "@/components/home/intro-welcome";
import { Newsletter } from "@/components/home/newsletter";
import { ValueProps } from "@/components/home/value-props";
import { SiteLayout } from "@/layouts/site-layout";

export function HomePage() {
  return (
    <SiteLayout>
      <main>
        <Hero />
        <IntroWelcome />
        <FeaturedCategories />
        <ValueProps />
        <FeaturedProducts />
        <ArtisanStory />
        <Newsletter />
      </main>
    </SiteLayout>
  );
}
