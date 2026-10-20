import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    if (process.env.DATABASE_URL) {
      try {
        await this.$connect();
      } catch (error) {
        console.warn('Initial Prisma connection attempt failed, retrying in 2 seconds...', error?.message);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await this.$connect();
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
