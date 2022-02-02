export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
  s3: {
    awsAccessKeyID: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKeyID: process.env.AWS_SECRET_ACCESS_KEY_ID,
    awsS3BucketName: process.env.AWS_BUCKET_NAME,
    awsSdkLoadConfig: process.env.AWS_SDK_LOAD_CONFIG,
  },
});
