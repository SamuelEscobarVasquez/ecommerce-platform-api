import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './entities/product.entity';
import { ProductsService } from './services/products.service';
import { S3Service } from './services/s3.service';
import { MulterS3ConfigService } from './services/multer-s3.config';
import { ProductsController } from './controllers/products.controller';

@Module({
  imports: [SequelizeModule.forFeature([Product])],
  providers: [ProductsService, S3Service, MulterS3ConfigService],
  controllers: [ProductsController],
})
export class ProductsModule {}