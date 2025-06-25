import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import * as multerS3 from 'multer-s3';

@Injectable()
export class MulterS3ConfigService {
  private s3: S3Client;
  private bucket: string;

  constructor(
    private config: ConfigService
  ) {
    // Initialize S3 client with configuration from ConfigService
    this.s3 = new S3Client({
      region: this.config.get<string>('AWS_REGION') ?? 'us-east-1',
      credentials: {
        accessKeyId: this.config.get<string>('AWS_ACCESS_KEY_ID') ?? '',
        secretAccessKey: this.config.get<string>('AWS_SECRET_ACCESS_KEY') ?? '',
      },
    });
    this.bucket = this.config.get<string>('AWS_BUCKET_NAME') ?? 'default-bucket';
  }

  createMulterOptions() {

    return {
      storage: multerS3({
        s3: this.s3,
        bucket: this.bucket,
        acl: 'public-read',
        key: (_req, file, cb) => {
          const filename = `products/${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
      fileFilter: (_req: any, file: any, cb: any) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(new Error('Solo imágenes JPG/PNG'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    };
  }
}