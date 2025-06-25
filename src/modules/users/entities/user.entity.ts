import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  Default,
} from 'sequelize-typescript';
import { Role } from './role.entity';
import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  declare id: CreationOptional<number>;

  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  declare username: string;

  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @ForeignKey(() => Role)
  @Column({ field: 'role_id', type: DataType.BIGINT, allowNull: false })
  declare roleId: number;

  @BelongsTo(() => Role)
  declare role?: Role;

  @Default(2)
  @Column({
    field: 'status',
    type: DataType.TINYINT.UNSIGNED,
    allowNull: false
  })
  declare status: CreationOptional<number>;

  @Column({
    field: 'last_login',
    type: DataType.DATE(6),
    allowNull: true
  })
  declare lastLogin: CreationOptional<Date>;

  @CreatedAt
  @Column({ field: 'created_at', type: DataType.DATE(6), allowNull: false })
  declare createdAt: CreationOptional<Date>;

  @UpdatedAt
  @Column({ field: 'updated_at', type: DataType.DATE(6), allowNull: true })
  declare updatedAt: CreationOptional<Date>;
}