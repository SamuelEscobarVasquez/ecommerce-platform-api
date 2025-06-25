import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Public } from 'src/common/decorators/public.decorator';
import RegisterResponse from '../interfaces/users.interface';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Public()
  @Post('/create')
  create(@Body() dto: CreateUserDto): Promise<RegisterResponse> {
    return this.usersService.createUser(dto);
  }
}
