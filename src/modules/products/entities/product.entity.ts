import {
  Table, Column, Model, DataType,
  PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt,
  Default
} from 'sequelize-typescript';
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

@Table({ tableName: 'products', timestamps: true })
export class Product extends Model<
  InferAttributes<Product>,
  InferCreationAttributes<Product>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  declare id: CreationOptional<number>;

  @Column({ type: DataType.STRING(150), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare description: CreationOptional<string>;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare price: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare sku: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare inventory: number;

  @Default(2)
  @Column({
    field: 'status',
    type: DataType.TINYINT.UNSIGNED,
    allowNull: false,
  })
  declare status: CreationOptional<number>;

  @Column({ type: DataType.STRING(255), allowNull: true, field: 'image_url' })
  declare imageUrl: CreationOptional<string>;

  @CreatedAt
  @Column({ field: 'created_at', type: DataType.DATE(6), allowNull: false })
  declare createdAt: CreationOptional<Date>;

  @Column({ type: DataType.BIGINT, allowNull: false, field: 'created_by' })
  declare createdBy: CreationOptional<number>;

  @UpdatedAt
  @Column({ field: 'updated_at', type: DataType.DATE(6), allowNull: true })
  declare updatedAt: CreationOptional<Date>;

  @Column({ type: DataType.BIGINT, allowNull: true, field: 'updated_by' })
  declare updatedBy: CreationOptional<number>;
}