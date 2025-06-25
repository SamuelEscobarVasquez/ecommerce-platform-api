import {
  Controller, Post, Get, Param, UseInterceptors, UploadedFile, Body,
  Logger,
  Req,
  Put,
  ParseIntPipe,
  Delete
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from '../services/products.service';
import { memoryStorage } from 'multer';
import { S3Service } from '../services/s3.service';
import { Request } from 'express';
import { UserLogged } from 'src/modules/auth/interfaces/auth.interface';
import { Public } from 'src/common/decorators/public.decorator';

const multerOptions = {
  storage: memoryStorage(),
  fileFilter: (_req: any, file: any, cb: any) => {
    const allowed = /\/(jpg|jpeg|png)$/;
    if (!file.mimetype.match(allowed)) {
      return cb(new Error('Solo imágenes JPG/PNG'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
};


@Controller('products')
export class ProductsController {
  constructor(
    private productsService: ProductsService,
    private readonly s3Service: S3Service,
  ) { }

  @Post('/create')
  @UseInterceptors(
    FileInterceptor('image', multerOptions),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: any,
    @Req() req: Request
  ) {
    // 1. Subir buffer a S3
    const imageUrl = await this.s3Service.uploadBuffer(
      file.buffer,
      file.originalname,
      file.mimetype,
    );

    let userLogged = req.user as UserLogged;
    return this.productsService.createProduct({
      ...dto,
      imageUrl,
      createdBy: userLogged.userId
    });
  }


  @Get('/get-product/:id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Get('/get-products')
  findAll() {
    Logger.log('Fetching all products');
    return this.productsService.findAll();
  }

  @Put('/update/:id')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: any,
    @Req() req: Request
  ) {
    if (file) {
      const imageUrl = await this.s3Service.uploadBuffer(
        file.buffer,
        file.originalname,
        file.mimetype,
      );
      dto.imageUrl = imageUrl;
    }
    
    let userLogged = req.user as UserLogged;
    return this.productsService.updateProduct(id, {
      ...dto,
      updatedBy: userLogged.userId
    });
  }

  @Delete('/delete/:id')
  async softDelete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request
  ) {
    let userLogged = req.user as UserLogged;
    await this.productsService.softDeleteProduct(id, userLogged.userId);
    return { message: 'Producto desactivado correctamente' };
  }

  @Public()
  @Get('/get-products-available')
  findAllProductsAvailable() {
    return this.productsService.findAllProductsAvailable();
  }
}
