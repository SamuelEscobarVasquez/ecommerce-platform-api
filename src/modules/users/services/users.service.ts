import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { PasswordHashService } from 'src/shared/services/password-hash.service';
import { PASSWORD_INVALID_MSG, UNEXPECTED_ERROR_CREATING_USER_MSG, USER_EMAIL_ALREADY_TAKEN_MSG, USER_NOT_FOUND_MSG, USERNAME_ALREADY_TAKEN_MSG } from 'src/messages';
import { USER_STATUS } from 'src/keys';
import { LoginUserDto } from '../dtos/login-user.dto';
import RegisterResponse from '../interfaces/users.interface';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private readonly passwordHashService: PasswordHashService
  ) { }

  async findOne(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new NotFoundException(USER_NOT_FOUND_MSG);
    return user;
  }

  async createUser(dto: CreateUserDto): Promise<RegisterResponse> {
    try {
      const alreadyExistUserUsername = await this.userModel.findOne({
        where: { username: dto.username, status: USER_STATUS.ACTIVE },
      });
      if (alreadyExistUserUsername) throw new ConflictException(USERNAME_ALREADY_TAKEN_MSG);

      const alreadyExistUserEmail = await this.userModel.findOne({
        where: { email: dto.email },
      });
      if (alreadyExistUserEmail) throw new ConflictException(USER_EMAIL_ALREADY_TAKEN_MSG);

      const hash = await this.passwordHashService.hashPassword(dto.password);
      const payload = { ...dto, password: hash, status: USER_STATUS.ACTIVE };

      let userCreated = await this.userModel.create(payload);

      return {
        userId: userCreated.id,
        username: userCreated.username,
        roleName: userCreated.role?.name ?? 'User',
      }
    } catch (error) {
      Logger.error('Error inserting user', error)
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(UNEXPECTED_ERROR_CREATING_USER_MSG);
    }
  }
}