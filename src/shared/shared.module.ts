import { Module, Global } from '@nestjs/common';
import { PasswordHashService } from './services/password-hash.service';
import { PassportModule } from '@nestjs/passport';

@Global()
@Module({
  providers: [
    PasswordHashService
  ],
  exports: [PasswordHashService],
})
export class SharedModule {}