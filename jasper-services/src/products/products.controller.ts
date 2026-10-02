import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';
import { AttachProductImageDto } from './dto/attach-product-image.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { ProductsService } from './products.service';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('products')
  findPublic(@Query() query: ProductQueryDto) {
    return this.productsService.findPublic(query);
  }

  @Get('products/:slug')
  findPublicBySlug(@Param('slug') slug: string) {
    return this.productsService.findPublicBySlug(slug);
  }

  @UseGuards(AdminAuthGuard)
  @Get('admin/products')
  findAdmin(@Query() query: ProductQueryDto) {
    return this.productsService.findAdmin(query);
  }

  @UseGuards(AdminAuthGuard)
  @Post('admin/products')
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @UseGuards(AdminAuthGuard)
  @Patch('admin/products/:id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @UseGuards(AdminAuthGuard)
  @Delete('admin/products/:id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @UseGuards(AdminAuthGuard)
  @Post('admin/products/:id/variants')
  createVariant(@Param('id') id: string, @Body() dto: CreateVariantDto) {
    return this.productsService.createVariant(id, dto);
  }

  @UseGuards(AdminAuthGuard)
  @Patch('admin/products/:id/variants/:variantId')
  updateVariant(
    @Param('id') id: string,
    @Param('variantId') variantId: string,
    @Body() dto: UpdateVariantDto,
  ) {
    return this.productsService.updateVariant(id, variantId, dto);
  }

  @UseGuards(AdminAuthGuard)
  @Delete('admin/products/:id/variants/:variantId')
  removeVariant(@Param('id') id: string, @Param('variantId') variantId: string) {
    return this.productsService.removeVariant(id, variantId);
  }

  @UseGuards(AdminAuthGuard)
  @Post('admin/products/:id/images')
  attachImage(@Param('id') id: string, @Body() dto: AttachProductImageDto) {
    return this.productsService.attachImage(id, dto);
  }

  @UseGuards(AdminAuthGuard)
  @Delete('admin/products/:id/images/:imageId')
  removeImage(@Param('id') id: string, @Param('imageId') imageId: string) {
    return this.productsService.removeImage(id, imageId);
  }
}
