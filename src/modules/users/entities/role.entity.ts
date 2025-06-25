import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({ tableName: 'roles', timestamps: false })
export class Role extends Model<Role, Partial<Role>> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER.UNSIGNED)
  declare id: number;

  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  declare name: string;

  @Column({ field: 'display_name', type: DataType.STRING(50), allowNull: false, unique: true })
  declare displayName: string;
}