import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class AddCartItemDto {
  @IsOptional()
  @IsString()
  variantId?: string;

  @IsOptional()
  @IsString()
  productId?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;
}
