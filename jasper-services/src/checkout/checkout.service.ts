import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CartService } from '../cart/cart.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';

const STANDARD_SHIPPING_FEE = 10.0; // $10.00 USD Standard Delivery

@Injectable()
export class CheckoutService {
  private readonly stripe?: Stripe;

  constructor(
    private readonly cartService: CartService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    const stripeKey = config.get<string>('STRIPE_SECRET_KEY');
    this.stripe = stripeKey ? new Stripe(stripeKey) : undefined;
  }

  async quote(cartToken?: string) {
    if (!cartToken) {
      throw new BadRequestException('Cart token is required');
    }

    const cart = await this.cartService.getCheckoutCart(cartToken);
    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const items = cart.items.map((item) => {
      const product = item.variant.product;
      const unitPrice = Number(product.price) + Number(item.variant.priceAdjustment);
      const lineTotal = unitPrice * item.quantity;
      const hasStock = item.variant.stockQuantity >= item.quantity;

      return {
        cartItemId: item.id,
        variantId: item.variantId,
        productName: product.name,
        quantity: item.quantity,
        unitPrice,
        lineTotal,
        hasStock,
      };
    });

    if (items.some((item) => !item.hasStock)) {
      throw new BadRequestException('One or more items are out of stock');
    }

    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const shippingFee = STANDARD_SHIPPING_FEE;
    const total = subtotal + shippingFee;

    return {
      currency: 'usd',
      subtotal,
      shippingFee,
      total,
      pickupOnly: false,
      items,
    };
  }

  async createCheckoutSession(cartToken: string | undefined, dto?: CreateSessionDto) {
    if (!cartToken) {
      throw new BadRequestException('Cart token is required');
    }

    if (!this.stripe) {
      throw new BadRequestException('Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables.');
    }

    const quote = await this.quote(cartToken);
    const corsOrigin = this.config.get<string>('CORS_ORIGIN') || 'http://localhost:3000';

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: quote.items.map((item) => ({
        price_data: {
          currency: quote.currency,
          product_data: {
            name: item.productName,
          },
          unit_amount: Math.round(item.unitPrice * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      phone_number_collection: {
        enabled: true,
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: Math.round(STANDARD_SHIPPING_FEE * 100), // $10.00 USD in cents
              currency: 'usd',
            },
            display_name: 'Standard US Delivery',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
      ],
      customer_email: dto?.customer?.email || undefined,
      success_url: `${corsOrigin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${corsOrigin}/cancel`,
      metadata: {
        cartToken,
      },
    });

    return {
      checkoutUrl: session.url,
    };
  }

  async getCheckoutSession(sessionId: string) {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not configured');
    }

    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    const order = await this.prisma.order.findUnique({
      where: { stripeSessionId: sessionId },
    });

    return {
      status: session.payment_status, // 'paid', 'unpaid', 'no_payment_required'
      orderNumber: order ? order.orderNumber : null,
      total: order ? Number(order.total) : (session.amount_total ? session.amount_total / 100 : null),
      currency: order ? order.currency : session.currency || 'usd',
    };
  }
}
