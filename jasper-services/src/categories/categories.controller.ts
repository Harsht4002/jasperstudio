import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('categories')
  findPublic() {
    return this.categoriesService.findPublic();
  }

  @Get('categories/:slug')
  findPublicBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findPublicBySlug(slug);
  }

  @UseGuards(AdminAuthGuard)
  @Post('admin/categories')
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @UseGuards(AdminAuthGuard)
  @Patch('admin/categories/:id')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @UseGuards(AdminAuthGuard)
  @Delete('admin/categories/:id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
