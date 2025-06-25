import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { PRODUCT_STATUS, PRODUCT_STATUS_ACTIVE } from 'src/keys';
import { Op } from 'sequelize';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product) private productModel: typeof Product
  ) { }

  createProduct(dto: CreateProductDto): Promise<Product> {
    return this.productModel.create(dto);
  }

  async findOne(id: number): Promise<Product> {
    const prod = await this.productModel.findByPk(id);
    if (!prod) throw new NotFoundException('Product not found');
    return prod;
  }

  findAll(): Promise<Product[]> {
    return this.productModel.findAll({ where: { status: PRODUCT_STATUS.ACTIVE } });
  }

  findAllProductsAvailable(): Promise<Product[]> {
    return this.productModel.findAll({
      where: {
        status: PRODUCT_STATUS.ACTIVE,
        inventory: { [Op.gt]: 5 }
      },
    });
  }

  async updateProduct(
    id: number,
    data: UpdateProductDto,
  ): Promise<Product> {
    // update devuelve [affectedCount]
    const [affected] = await this.productModel.update(data, {
      where: { id },
    });
    if (!affected) {
      throw new NotFoundException(`Producto ${id} no encontrado`);
    }
    // Recupera el producto actualizado
    const updated = await this.productModel.findByPk(id);
    if (!updated) {
      throw new NotFoundException(`Producto ${id} no encontrado`);
    }
    return updated
  }

  async softDeleteProduct(id: number, userId: number): Promise<void> {
    const [affected] = await this.productModel.update(
      { status: PRODUCT_STATUS.DELETED, updatedBy: userId },
      { where: { id } },
    );
    if (!affected) throw new NotFoundException(`Producto ${id} no encontrado`);
  }
}