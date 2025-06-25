import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordHashService {

  async hashPassword(pass: string): Promise<string> {
    return bcrypt.hash(pass, +bcrypt.genSalt());
  }
  
  async comparePassword(pass: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(pass, hashed);
  }
}