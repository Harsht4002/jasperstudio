import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';
import {
  CurrentAdmin,
  CurrentAdmin as CurrentAdminDecorator,
} from '../common/decorators/current-admin.decorator';
import { AdminAuthService } from './admin-auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.adminAuthService.login(dto);
  }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.adminAuthService.register(dto);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.adminAuthService.refresh(dto.refreshToken);
  }

  @UseGuards(AdminAuthGuard)
  @Post('logout')
  logout(@CurrentAdminDecorator() admin: CurrentAdmin) {
    return this.adminAuthService.logout(admin.adminUserId);
  }

  @UseGuards(AdminAuthGuard)
  @Get('me')
  me(@CurrentAdminDecorator() admin: CurrentAdmin) {
    return this.adminAuthService.me(admin.adminUserId);
  }
}
