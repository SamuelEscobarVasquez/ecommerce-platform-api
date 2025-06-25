import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleSeederService implements OnApplicationBootstrap {
  private readonly defaultRoles = ['Administrador', 'Colaborador'];

  constructor(
    @InjectModel(Role)
    private readonly roleModel: typeof Role,
  ) { }

  async onApplicationBootstrap() {
    const count = await this.roleModel.count();
    if (count === 0) {
      Logger.log('Not found roles, starting to inserts default roles:', JSON.stringify(this.defaultRoles));
      await Promise.all(
        this.defaultRoles.map(name => this.roleModel.create({
          name: name,
          displayName: name
        })),
      );
      Logger.log('[Seed] Roles iniciales creados:', this.defaultRoles);
    }
  }
}