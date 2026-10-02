import { Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';
import { SignedUploadUrlDto } from './dto/signed-upload-url.dto';
import { StorageService } from './storage.service';

@UseGuards(AdminAuthGuard)
@Controller('admin/uploads')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('signed-url')
  createSignedUploadUrl(@Body() dto: SignedUploadUrlDto) {
    return this.storageService.createSignedUploadUrl(dto);
  }

  @Delete(':path')
  remove(@Param('path') path: string) {
    return this.storageService.remove(path);
  }
}
