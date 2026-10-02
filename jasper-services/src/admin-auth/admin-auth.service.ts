import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

type TokenPayload = {
  sub: string;
  email: string;
  role: string;
};

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!admin?.isActive) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      admin.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    const tokens = await this.issueTokens({
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    });

    await this.prisma.adminUser.update({
      where: { id: admin.id },
      data: { refreshTokenHash: await bcrypt.hash(tokens.refreshToken, 10) },
    });

    return {
      ...tokens,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  }

  async register(dto: RegisterDto) {
    const activeAdminCount = await this.prisma.adminUser.count({
      where: { isActive: true },
    });

    if (activeAdminCount > 0) {
      throw new ConflictException('Admin registration is closed');
    }

    const admin = await this.prisma.adminUser.create({
      data: {
        email: dto.email.toLowerCase(),
        name: dto.name.trim(),
        passwordHash: await bcrypt.hash(dto.password, 10),
        role: 'OWNER',
      },
    });

    const tokens = await this.issueTokens({
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    });

    await this.prisma.adminUser.update({
      where: { id: admin.id },
      data: { refreshTokenHash: await bcrypt.hash(tokens.refreshToken, 10) },
    });

    return {
      ...tokens,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  }

  async refresh(refreshToken: string) {
    let payload: TokenPayload;

    try {
      payload = await this.jwtService.verifyAsync<TokenPayload>(refreshToken, {
        secret: this.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const admin = await this.prisma.adminUser.findUnique({
      where: { id: payload.sub },
    });

    if (!admin?.refreshTokenHash || !admin.isActive) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokenMatches = await bcrypt.compare(
      refreshToken,
      admin.refreshTokenHash,
    );

    if (!tokenMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.issueTokens({
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    });

    await this.prisma.adminUser.update({
      where: { id: admin.id },
      data: { refreshTokenHash: await bcrypt.hash(tokens.refreshToken, 10) },
    });

    return tokens;
  }

  async logout(adminUserId: string) {
    await this.prisma.adminUser.update({
      where: { id: adminUserId },
      data: { refreshTokenHash: null },
    });

    return { success: true };
  }

  async me(adminUserId: string) {
    return this.prisma.adminUser.findUnique({
      where: { id: adminUserId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  private async issueTokens(payload: TokenPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.refreshSecret,
        expiresIn: (this.config.get<string>('JWT_REFRESH_EXPIRES_IN') ??
          '30d') as never,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
    };
  }

  private get refreshSecret() {
    return (
      this.config.get<string>('JWT_REFRESH_SECRET') ??
      this.config.get<string>('JWT_ACCESS_SECRET') ??
      'dev-refresh-secret'
    );
  }
}
