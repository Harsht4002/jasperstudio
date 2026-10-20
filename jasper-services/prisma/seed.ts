import { PrismaClient, ProductStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. Seed Categories
  const categories = [
    {
      name: 'Home Essentials',
      slug: 'home-essentials',
      description: 'Crafted pieces for everyday rituals',
      displayOrder: 10,
    },
    {
      name: 'Attars',
      slug: 'attars',
      description: 'Traditional fragrance, bottled by hand',
      displayOrder: 20,
    },
    {
      name: 'Festive Edit',
      slug: 'festive-edit',
      description: 'Seasonal collections, made for celebration',
      displayOrder: 30,
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Small details, made to last',
      displayOrder: 40,
    },
    {
      name: 'Bowls',
      slug: 'bowls',
      description: 'Handmade bowls for daily rituals and serving.',
      displayOrder: 50,
    },
    {
      name: 'Cups',
      slug: 'cups',
      description: 'Studio cups, mugs, and small vessels.',
      displayOrder: 60,
    },
    {
      name: 'Vases',
      slug: 'vases',
      description: 'Ceramic vessels for stems, shelves, and tables.',
      displayOrder: 70,
    },
    {
      name: 'Plates',
      slug: 'plates',
      description: 'Small-batch plates and serving pieces.',
      displayOrder: 80,
    },
  ];

  const createdCategories: Record<string, string> = {};

  for (const category of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    createdCategories[cat.slug] = cat.id;
  }

  // 2. Seed Default Admin User
  const adminEmail = 'admin@artisanal.shop';
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('AdminPassword123!', 10);
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        name: 'Master Artisan',
        passwordHash,
        role: 'OWNER',
        isActive: true,
      },
    });
    console.log('Created default admin user: admin@artisanal.shop / AdminPassword123!');
  } else {
    console.log('Default admin user already exists.');
  }

  // 3. Seed Sample Products
  const sampleProducts = [
    {
      name: 'Terracotta Ritual Bowl',
      slug: 'terracotta-ritual-bowl',
      description: 'Wheel-thrown terracotta bowl finished with a subtle matte chalk glaze.',
      price: 48.00,
      categorySlug: 'bowls',
      status: ProductStatus.PUBLISHED,
    },
    {
      name: 'Speckled Stoneware Mug',
      slug: 'speckled-stoneware-mug',
      description: 'Tactile stoneware mug crafted with natural iron speckles and an ergonomic handle.',
      price: 36.00,
      categorySlug: 'cups',
      status: ProductStatus.PUBLISHED,
    },
    {
      name: 'Fluted Minimal Vase',
      slug: 'fluted-minimal-vase',
      description: 'Hand-carved fluted vase for dried florals or single botanical stems.',
      price: 72.00,
      categorySlug: 'vases',
      status: ProductStatus.PUBLISHED,
    },
    {
      name: 'Rustic Breakfast Plate',
      slug: 'rustic-breakfast-plate',
      description: 'Slightly asymmetrical dinner plate featuring an organic raw ceramic rim.',
      price: 42.00,
      categorySlug: 'plates',
      status: ProductStatus.PUBLISHED,
    },
  ];

  for (const prod of sampleProducts) {
    const categoryId = createdCategories[prod.categorySlug];
    const existing = await prisma.product.findUnique({ where: { slug: prod.slug } });
    if (!existing) {
      const product = await prisma.product.create({
        data: {
          name: prod.name,
          slug: prod.slug,
          description: prod.description,
          price: prod.price,
          status: prod.status,
          categoryId,
          variants: {
            create: [
              {
                sku: `${prod.slug}-default`,
                stockQuantity: 15,
                isActive: true,
              },
            ],
          },
        },
      });
      console.log(`Seeded product: ${product.name}`);
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
