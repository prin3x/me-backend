export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  database: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    migration: process.env.POSTGRES_MIGRATION,
  },
  s3: {
    awsAccessKeyID: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKeyID: process.env.AWS_SECRET_ACCESS_KEY_ID,
    awsS3BucketName: process.env.AWS_BUCKET_NAME,
    awsSdkLoadConfig: process.env.AWS_SDK_LOAD_CONFIG,
  },
  botApiKey: process.env.BOT_API_KEY,
});
