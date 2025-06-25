import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../../users/dtos/login-user.dto';
import { User } from '../../users/entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { USER_STATUS } from 'src/keys';
import { PASSWORD_INVALID_MSG, UNEXPECTED_ERROR_CREATING_USER_MSG, USER_NOT_FOUND_MSG, USER_STATUS_INACTIVE_MSG } from 'src/messages';
import { PasswordHashService } from 'src/shared/services/password-hash.service';
import LoginResponse from '../interfaces/auth.interface';
import { Role } from 'src/modules/users/entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Role)
    private roleModel: typeof Role,
    private readonly passwordHashService: PasswordHashService,
    private jwtService: JwtService,
  ) { }

  async loginUser(dto: LoginUserDto): Promise<LoginResponse> {
    try {
      const user = await this.userModel.findOne({
        where: { email: dto.email, status: USER_STATUS.ACTIVE },
      });
      if (!user) throw new NotFoundException(USER_NOT_FOUND_MSG);

      const isPasswordValid = await this.passwordHashService.comparePassword(dto.password, user.password);
      if (!isPasswordValid) throw new BadRequestException(PASSWORD_INVALID_MSG);

      const currentRole = await this.roleModel.findByPk(user.roleId);
      if (!currentRole) {
        throw new UnauthorizedException(USER_STATUS_INACTIVE_MSG);
      }

      const payload = { sub: user.id, username: user.username, roleId: user.roleId };
      let token = this.jwtService.sign(payload);

      return {
        accessToken: token,
        userId: user.id,
        username: user.username,
        roleName: currentRole.displayName,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(UNEXPECTED_ERROR_CREATING_USER_MSG);
    }
  }
}
