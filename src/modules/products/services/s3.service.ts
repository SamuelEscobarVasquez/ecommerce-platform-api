import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand, Bucket } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {

  private s3: S3Client;
  private bucket: string;

  constructor(private config: ConfigService) {
    this.s3 = new S3Client({
      region: this.config.get('AWS_REGION') ?? 'us-east-1',
      credentials: {
        accessKeyId: this.config.get('AWS_ACCESS_KEY_ID') ?? 'INVALID_ACCESS_KEY',
        secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY') ?? 'INVALID_SECRET_KEY',
      },
    });
    this.bucket = this.config.get('AWS_BUCKET_NAME') ?? 'default-bucket';
  }

  async uploadBuffer(buffer: Buffer, originalName: string, mimetype: string): Promise<string> {
    const key = `products/${uuidv4()}-${originalName}`;
    try {
      await this.s3.send(new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: mimetype
      }));
      return `https://${this.bucket}.s3.amazonaws.com/${key}`;
    } catch (err) {
      Logger.error('Error uploading file to S3:', err);
      throw new InternalServerErrorException('Error uploading file to S3');
    }
  }
}