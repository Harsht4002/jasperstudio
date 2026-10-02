import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AttachProductImageDto } from './dto/attach-product-image.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

// Simple in-memory cache for product list responses. Use Redis in production for shared cache.
const productListCache = new Map<string, { expires: number; value: any }>();
const CACHE_TTL_MS = Number(process.env.PRODUCTS_LIST_CACHE_TTL_MS) || 60_000;

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  private clearProductListCache() {
    productListCache.clear();
  }

  findPublic(query: ProductQueryDto) {
    return this.findMany(query, { status: 'PUBLISHED' });
  }

  findAdmin(query: ProductQueryDto) {
    return this.findMany(query);
  }

  async findPublicBySlug(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: { slug, status: 'PUBLISHED' },
      include: { category: true, images: true, variants: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.toPublicProduct(product);
  }

  async create(dto: CreateProductDto) {
    const { categoryId, initialStock, ...data } = dto;
    const result = await this.prisma.product.create({
      data: {
        ...data,
        category: categoryId ? { connect: { id: categoryId } } : undefined,
        variants: {
          create: {
            optionName: 'Default',
            optionValue: 'Default',
            stockQuantity: initialStock ?? 0,
          },
        },
      },
      include: { category: true, images: true, variants: true },
    });

    // invalidate list cache
    this.clearProductListCache();
    return result;
  }

  async update(id: string, dto: UpdateProductDto) {
    const { categoryId, initialStock, ...data } = dto;
    void initialStock;

    const result = await this.prisma.product.update({
      where: { id },
      data: {
        ...data,
        category: categoryId ? { connect: { id: categoryId } } : undefined,
      },
    });

    // invalidate list cache
    this.clearProductListCache();
    return result;
  }

  async remove(id: string) {
    await this.prisma.product.delete({ where: { id } });
    this.clearProductListCache();
    return { success: true };
  }

  async createVariant(productId: string, dto: CreateVariantDto) {
    const result = await this.prisma.productVariant.create({
      data: {
        ...dto,
        product: { connect: { id: productId } },
      },
    });
    this.clearProductListCache();
    return result;
  }

  async updateVariant(productId: string, variantId: string, dto: UpdateVariantDto) {
    const result = await this.prisma.productVariant.update({
      where: { id: variantId, productId },
      data: dto,
    });
    this.clearProductListCache();
    return result;
  }

  async removeVariant(productId: string, variantId: string) {
    await this.prisma.productVariant.delete({
      where: { id: variantId, productId },
    });
    this.clearProductListCache();
    return { success: true };
  }

  async attachImage(productId: string, dto: AttachProductImageDto) {
    const result = await this.prisma.productImage.create({
      data: {
        ...dto,
        product: { connect: { id: productId } },
      },
    });
    this.clearProductListCache();
    return result;
  }

  async removeImage(productId: string, imageId: string) {
    await this.prisma.productImage.delete({
      where: { id: imageId, productId },
    });
    this.clearProductListCache();
    return { success: true };
  }

  private async findMany(
    query: ProductQueryDto,
    baseWhere: Prisma.ProductWhereInput = {},
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 24;
    const categorySlug = query.categorySlug ?? query.category;
    const price: Prisma.DecimalFilter | undefined =
      query.minPrice !== undefined || query.maxPrice !== undefined
        ? {
            gte: query.minPrice,
            lte: query.maxPrice,
          }
        : undefined;
    const where: Prisma.ProductWhereInput = {
      ...baseWhere,
      category: categorySlug ? { slug: categorySlug } : undefined,
      price,
      OR: query.search
        ? [
            { name: { contains: query.search, mode: 'insensitive' } },
            { description: { contains: query.search, mode: 'insensitive' } },
          ]
        : undefined,
    };
    const orderBy =
      query.sortBy === 'price_asc'
        ? { price: 'asc' as const }
        : query.sortBy === 'price_desc'
          ? { price: 'desc' as const }
          : { createdAt: 'desc' as const };

    // caching: attempt to serve from in-memory cache
    const cacheKey = JSON.stringify({ page, limit, categorySlug, search: query.search, minPrice: query.minPrice, maxPrice: query.maxPrice, sortBy: query.sortBy, baseWhere });
    try {
      const cached = productListCache.get(cacheKey);
      if (cached && cached.expires > Date.now()) {
        return cached.value;
      }
    } catch (err) {
      // ignore cache read errors
    }

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        // lean projection for list endpoints: only essential fields to reduce payload
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          price: true,
          currency: true,
          createdAt: true,
          updatedAt: true,
          category: { select: { id: true, name: true, slug: true } },
          images: {
            select: { id: true, url: true, path: true, altText: true, isPrimary: true },
            orderBy: [
              { isPrimary: 'desc' },
              { sortOrder: 'asc' },
            ],
            take: 1,
          },
          // omit variants in list payload to avoid over-fetching; variants are fetched on product detail
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    const result = {
      data: data.map((product) => this.toListProduct(product)),
      total,
      page,
      limit,
    };

    try {
      productListCache.set(cacheKey, { expires: Date.now() + CACHE_TTL_MS, value: result });
    } catch (err) {
      // ignore cache write errors
    }

    return result;
  }

  private toListProduct(product: any) {
    const basePrice = Number(product.price ?? 0);

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: basePrice,
      basePrice,
      currency: product.currency,
      category: product.category
        ? {
            id: product.category.id,
            name: product.category.name,
            slug: product.category.slug,
          }
        : null,
      images: (product.images ?? []).map((image: any) => ({
        id: image.id,
        url: image.url,
        path: image.path,
        alt: image.altText,
        altText: image.altText,
        isPrimary: image.isPrimary,
      })),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  private toPublicProduct(
    product: Prisma.ProductGetPayload<{
      include: { category: true; images: true; variants: true };
    }>,
  ) {
    const basePrice = Number(product.price ?? 0);

    const images = (product.images ?? []).slice().sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0));
    const variants = (product.variants ?? []).filter((variant) => variant.isActive);

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      status: product.status,
      price: basePrice,
      basePrice,
      currency: product.currency,
      category: product.category
        ? {
            id: product.category.id,
            name: product.category.name,
            slug: product.category.slug,
          }
        : null,
      images: images.map((image) => ({
        id: image.id,
        url: image.url,
        path: image.path,
        alt: image.altText,
        altText: image.altText,
        isPrimary: image.isPrimary,
      })),
      variants: variants.map((variant) => ({
        id: variant.id,
        name:
          variant.optionValue ??
          variant.optionName ??
          variant.sku ??
          'Default',
        optionName: variant.optionName,
        optionValue: variant.optionValue,
        sku: variant.sku,
        price: basePrice + Number(variant.priceAdjustment ?? 0),
        inventory: variant.stockQuantity,
        stockQuantity: variant.stockQuantity,
      })),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
