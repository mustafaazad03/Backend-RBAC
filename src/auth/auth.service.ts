import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/common/enums/role.enum';
import { google } from 'googleapis';
import { getUserDetailFromIdToken } from './utils/google';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ success: boolean, message: string, statusCode: number }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    const user = this.userRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      role: registerDto.role || Role.USER,
    });

    await this.userRepository.save(user);

    return {
      success: true,
      message: 'User created successfully',
      statusCode: 201
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    
    return {
      success: true,
      message: 'Logged in successfully',
      statusCode: 200,
      data: tokens
    };
  }

  async logout(userId: string) {
    await this.userRepository.update(userId, { refreshToken: null });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access denied');
    }

    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      success: true,
      message: 'Tokens refreshed successfully',
      statusCode: 200,
      data: tokens
    };
  }

  private async getTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
          role: user.role,
        },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
          role: user.role,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
        accessToken,
        refreshToken
    };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  // Optional Task for Google Auth
  async googleLogin(googleIdToken: string) {
    const callbackUrl = `${process.env.BACKEND_URL}/auth/google/callback`
		const oauth2Client = new google.auth.OAuth2(
			process.env.GOOGLE_CLIENT_ID,
			process.env.GOOGLE_CLIENT_SECRET,
			callbackUrl
		);
		const codeResponse = await oauth2Client.getToken(googleIdToken);
		const { tokens } = codeResponse;
		const { id_token } = tokens;
		if (!id_token) {
			throw new BadRequestException("No id_token found");
		}
		const userDetails = await getUserDetailFromIdToken(id_token);
		if (!userDetails) {
			throw new UnauthorizedException("Invalid user details");
		}
		const existingUserEntity = await this.userRepository.findOne({
			where: { email: userDetails.email },
		});

		if (existingUserEntity) {
      const jwtToken = jwt.sign(
        {
          id: existingUserEntity.id,
          email: existingUserEntity.email,
          role: existingUserEntity.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '60d',
        },
      );
      return {
        success: true,
        message: 'Logged in successfully',
        statusCode: 200,
        data: jwtToken
      }
		}
		// Convert existingUser object to simple object
		const simpleExistingUserObject = {
			email: userDetails.email,
      role: Role.USER,
      password: null
		};

    const newUserEntity = this.userRepository.create(simpleExistingUserObject);
    await this.userRepository.save(newUserEntity);

    const jwtToken = jwt.sign(
      {
        id: newUserEntity.id,
        email: newUserEntity.email,
        role: newUserEntity.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '60d',
      },
    );
    return {
      success: true,
      message: 'Logged in successfully',
      statusCode: 200,
      data: jwtToken
    }
  }
}