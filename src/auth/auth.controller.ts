import { Controller, Post, Body, UseGuards, Get, Req, Res, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { Public } from '../common/decorators/public.decorator';
import { Role } from '../common/enums/role.enum';
import { Roles } from 'src/common/decorators/role.decorator';
import { RolesGuard } from './guard/role.guard';
import { getGoogleAuthorizationRoute } from './utils/google';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  async logout(@Req() req) {
    await this.authService.logout(req.user.id);
    return { message: 'Successfully logged out' };
  }

  @Post('refresh')
  async refreshTokens(@Req() req) {
    const userId = req.user.id;
    const refreshToken = req.user.refreshToken;
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  // Testing RolesGuard for Admin
  @Get('admin')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  adminRoute() {
    return { message: 'Admin access granted' };
  }

  // Testing RolesGuard for Maintainer and Admin
  @Get('maintainer')
  @Roles(Role.MAINTAINER, Role.ADMIN)
  @UseGuards(RolesGuard)
  maintainerRoute() {
    return { message: 'Maintainer access granted' };
  }

  // Additional Optional Task
	@Public()
  @Get("google/redirectUrl")
	async googleAuth(@Res() res: Response){
		const redirectUrl = await getGoogleAuthorizationRoute();
		return res.json({
      success: true,
      data: redirectUrl,
      statusCode: 200
    });
	}

	@Public()
	@Get("google/callback")
	async googleCallback(
		@Req() req: Request,
		@Res() res: Response,
		@Query("code") code: string,
	) {
    const generatedTokens = await this.authService.googleLogin(code);
    await res.cookie("auth", generatedTokens.data, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });
    return res.redirect(process.env.CLIENT_URL);
	}
}
