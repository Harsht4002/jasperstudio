import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async find(cartToken?: string) {
    if (!cartToken) {
      return this.toCartResponse({ token: null, items: [] });
    }

    const cart = await this.prisma.cart.findUnique({
      where: { token: cartToken },
      include: this.cartInclude,
    });

    return this.toCartResponse(cart ?? { token: cartToken, items: [] });
  }

  async addItem(cartToken: string | undefined, dto: AddCartItemDto) {
    if (!dto.productId && !dto.variantId) {
      throw new BadRequestException('Product id is required');
    }

    const variant = await this.prisma.productVariant.findFirst({
      where: {
        id: dto.variantId,
        productId: dto.productId,
        isActive: true,
        product: { status: 'PUBLISHED' },
      },
      orderBy: { createdAt: 'asc' },
      include: { product: true },
    });

    if (!variant) {
      throw new NotFoundException('Product variant not found');
    }

    if (variant.stockQuantity < dto.quantity) {
      throw new BadRequestException('Not enough stock available');
    }

    const cart = await this.getOrCreateCart(cartToken);
    await this.prisma.cartItem.upsert({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId: variant.id,
        },
      },
      update: {
        quantity: { increment: dto.quantity },
        priceSnapshot: variant.product.price,
      },
      create: {
        cartId: cart.id,
        variantId: variant.id,
        quantity: dto.quantity,
        priceSnapshot: variant.product.price,
      },
    });

    return this.find(cart.token);
  }

  async updateItem(
    cartToken: string | undefined,
    itemId: string,
    dto: UpdateCartItemDto,
  ) {
    const cart = await this.requireCart(cartToken);
    await this.prisma.cartItem.update({
      where: { id: itemId, cartId: cart.id },
      data: { quantity: dto.quantity },
    });

    return this.find(cart.token);
  }

  async removeItem(cartToken: string | undefined, itemId: string) {
    const cart = await this.requireCart(cartToken);
    await this.prisma.cartItem.delete({ where: { id: itemId, cartId: cart.id } });
    return this.find(cart.token);
  }

  async clear(cartToken?: string) {
    if (!cartToken) {
      return { success: true };
    }

    await this.prisma.cart.deleteMany({ where: { token: cartToken } });
    return { success: true };
  }

  async getCheckoutCart(cartToken: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { token: cartToken },
      include: this.cartInclude,
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    return cart;
  }

  private async getOrCreateCart(cartToken?: string) {
    if (cartToken) {
      const existing = await this.prisma.cart.findUnique({
        where: { token: cartToken },
      });

      if (existing) {
        return existing;
      }
    }

    return this.prisma.cart.create({
      data: {
        token: randomUUID(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
    });
  }

  private async requireCart(cartToken?: string) {
    if (!cartToken) {
      throw new NotFoundException('Cart not found');
    }

    const cart = await this.prisma.cart.findUnique({ where: { token: cartToken } });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return cart;
  }

  private readonly cartInclude = {
    items: {
      include: {
        variant: {
          include: {
            product: {
              include: { images: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' as const },
    },
  };

  private toCartResponse(cart: {
    id?: string;
    token: string | null;
    items: Array<{
      id: string;
      quantity: number;
      priceSnapshot: Prisma.Decimal;
      variant: {
        id: string;
        optionName: string | null;
        optionValue: string | null;
        sku: string | null;
        product: {
          id: string;
          name: string;
          slug: string;
          currency: string;
          images: Array<{
            id: string;
            url: string;
            altText: string | null;
            sortOrder: number;
          }>;
        };
      };
    }>;
  }) {
    const items = cart.items.map((item) => {
      const unitPrice = Number(item.priceSnapshot);
      const lineTotal = unitPrice * item.quantity;

      return {
        id: item.id,
        variantId: item.variant.id,
        quantity: item.quantity,
        unitPrice,
        lineTotal,
        product: {
          id: item.variant.product.id,
          name: item.variant.product.name,
          slug: item.variant.product.slug,
          currency: item.variant.product.currency,
          image:
            item.variant.product.images.sort(
              (left, right) => left.sortOrder - right.sortOrder,
            )[0] ?? null,
        },
        variant: {
          id: item.variant.id,
          name:
            item.variant.optionValue ??
            item.variant.optionName ??
            item.variant.sku ??
            'Default',
          optionName: item.variant.optionName,
          optionValue: item.variant.optionValue,
          sku: item.variant.sku,
        },
      };
    });

    return {
      id: cart.id,
      cartToken: cart.token,
      items,
      totalItems: items.reduce((total, item) => total + item.quantity, 0),
      subtotal: items.reduce((total, item) => total + item.lineTotal, 0),
    };
  }
}
