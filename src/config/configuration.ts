export default () => ({
  DB_HOST: process.env.DB_HOST ?? 'localhost',
  DB_PORT: process.env.DB_PORT ?? 3306,
  DB_USER: process.env.DB_USER ?? 'root',
  DB_PASS: process.env.DB_PASS,
  DB_NAME: process.env.DB_NAME ?? 'dbecommerceplatform',
  PORT: process.env.PORT ?? 3200,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION ?? 'us-east-1',
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME ?? 'product-images-cemaco',
});