import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { SignedUploadUrlDto } from './dto/signed-upload-url.dto';

@Injectable()
export class StorageService {
  private readonly bucket: string;
  private readonly client?: SupabaseClient;

  constructor(config: ConfigService) {
    this.bucket = config.get<string>('SUPABASE_PRODUCT_IMAGES_BUCKET') ?? 'product-images';
    const url = config.get<string>('SUPABASE_URL');
    const serviceRoleKey = config.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    this.client =
      url && serviceRoleKey
        ? createClient(url, serviceRoleKey, {
            auth: { persistSession: false, autoRefreshToken: false },
          })
        : undefined;
  }

  async createSignedUploadUrl(dto: SignedUploadUrlDto) {
    if (!this.client) {
      throw new BadRequestException('Supabase Storage is not configured');
    }

    const path = this.buildProductImagePath(dto.fileName);
    const { data, error } = await this.client.storage
      .from(this.bucket)
      .createSignedUploadUrl(path);

    if (error) {
      throw new BadRequestException(error.message);
    }

    const { data: publicUrl } = this.client.storage
      .from(this.bucket)
      .getPublicUrl(path);

    return {
      path,
      signedUrl: data.signedUrl,
      token: data.token,
      publicUrl: publicUrl.publicUrl,
    };
  }

  async remove(path: string) {
    if (!this.client) {
      throw new BadRequestException('Supabase Storage is not configured');
    }

    const { error } = await this.client.storage.from(this.bucket).remove([path]);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return { success: true };
  }

  private buildProductImagePath(fileName: string) {
    const safeName = fileName.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
    return `products/${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${safeName}`;
  }
}
