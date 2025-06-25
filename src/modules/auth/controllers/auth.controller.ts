import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginUserDto } from '../../users/dtos/login-user.dto';
import { Public } from '../../../common/decorators/public.decorator';
import LoginResponse from '../interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() dto: LoginUserDto): Promise<LoginResponse> {
    return this.authService.loginUser(dto);
  }
}
