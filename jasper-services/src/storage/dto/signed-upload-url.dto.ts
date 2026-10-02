import { IsIn, IsString, Matches } from 'class-validator';

export class SignedUploadUrlDto {
  @IsString()
  @Matches(/\.(png|jpe?g|webp|gif)$/i)
  fileName!: string;

  @IsString()
  @IsIn(['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
  contentType!: string;
}
