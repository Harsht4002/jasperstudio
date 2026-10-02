import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  private readonly stripe?: Stripe;
  private readonly webhookSecret?: string;

  constructor(
    private readonly prisma: PrismaService,
    config: ConfigService,
  ) {
    const stripeKey = config.get<string>('STRIPE_SECRET_KEY');
    this.webhookSecret = config.get<string>('STRIPE_WEBHOOK_SECRET');
    this.stripe = stripeKey ? new Stripe(stripeKey) : undefined;
  }

  async handleStripeWebhook(rawBody: Buffer, signature?: string) {
    if (!this.stripe || !this.webhookSecret || !signature) {
      throw new BadRequestException('Stripe webhook is not configured');
    }

    const event = this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      this.webhookSecret,
    );

    if (event.type === 'checkout.session.completed') {
      await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
    }

    return { received: true };
  }

  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const metadata = session.metadata;
    if (!metadata || !metadata.cartToken) {
      console.error('No metadata or cartToken found in checkout session', session.id);
      return;
    }

    const cartToken = metadata.cartToken;

    // 1. Idempotency Check: check if order with this session.id already exists
    const existingOrder = await this.prisma.order.findUnique({
      where: { stripeSessionId: session.id },
    });
    if (existingOrder) {
      console.log('Order already created for checkout session', session.id);
      return;
    }

    // 2. Load Cart
    const cart = await this.prisma.cart.findUnique({
      where: { token: cartToken },
      include: {
        items: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      console.error('Cart is empty or not found for token', cartToken);
      return;
    }

    // 3. Extract Customer & Delivery Address details from Stripe Session
    const customerDetails = session.customer_details;
    const shippingDetails =
      (session as any).shipping_details ||
      (session as any).collected_information?.shipping_details;
    const address = shippingDetails?.address;

    const customerName =
      shippingDetails?.name || customerDetails?.name || metadata.customerName || 'Customer';
    const customerEmail = customerDetails?.email || metadata.customerEmail || '';
    const customerPhone =
      customerDetails?.phone || shippingDetails?.phone || metadata.customerPhone || null;

    const shippingAddress1 = address?.line1 || metadata.shippingAddress1 || null;
    const shippingAddress2 = address?.line2 || metadata.shippingAddress2 || null;
    const shippingCity = address?.city || metadata.shippingCity || null;
    const shippingState = address?.state || metadata.shippingState || null;
    const shippingPostalCode = address?.postal_code || metadata.shippingPostalCode || null;
    const shippingCountry = address?.country || metadata.shippingCountry || 'US';

    // 4. Calculate prices
    const items = cart.items.map((item) => {
      const unitPrice = Number(item.variant.product.price) + Number(item.variant.priceAdjustment);
      const lineTotal = unitPrice * item.quantity;
      return {
        variantId: item.variantId,
        productName: item.variant.product.name,
        quantity: item.quantity,
        unitPrice,
        lineTotal,
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const shippingFee = session.total_details?.amount_shipping
      ? Number(session.total_details.amount_shipping) / 100
      : 10.0;
    const total = session.amount_total
      ? Number(session.amount_total) / 100
      : subtotal + shippingFee;

    // 5. Create Order, items, payment and log inventory inside a Prisma Transaction
    await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber: this.createOrderNumber(),
          customerName,
          customerEmail,
          customerPhone,
          status: 'PAID',
          subtotal,
          shippingFee,
          total,
          currency: session.currency || 'usd',
          stripeSessionId: session.id,
          stripePaymentIntentId: (session.payment_intent as string) || null,
          shippingAddress1,
          shippingAddress2,
          shippingCity,
          shippingState,
          shippingPostalCode,
          shippingCountry,
          items: {
            create: items.map((item) => ({
              variantId: item.variantId,
              productName: item.productName,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              lineTotal: item.lineTotal,
            })),
          },
        },
        include: { items: true },
      });

      // Create payment record
      await tx.payment.create({
        data: {
          orderId: order.id,
          provider: 'stripe',
          providerPaymentId: (session.payment_intent as string) || session.id,
          amount: order.total,
          currency: order.currency,
          status: 'SUCCEEDED',
        },
      });

      // Decrement stock and log inventory
      for (const item of order.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stockQuantity: { decrement: item.quantity } },
        });

        await tx.inventoryLog.create({
          data: {
            variantId: item.variantId,
            orderId: order.id,
            delta: -item.quantity,
            reason: 'ORDER_PAID',
            note: `Stripe Checkout Session completed: ${session.id}`,
          },
        });
      }

      // Clear the guest cart items
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    });
  }

  private createOrderNumber() {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `JS-${date}-${suffix}`;
  }
}
