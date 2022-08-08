export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  database: {
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT, 10) || 5432,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    migration: process.env.MYSQL_MIGRATION,
    schema: process.env.MYSQL_DROP_SCHEMA,
  },
  // s3: {
  //   awsAccessKeyID: process.env.AWS_ACCESS_KEY_ID,
  //   awsSecretAccessKeyID: process.env.AWS_SECRET_ACCESS_KEY_ID,
  //   awsS3BucketName: process.env.AWS_BUCKET_NAME,
  //   awsSdkLoadConfig: process.env.AWS_SDK_LOAD_CONFIG,
  // },
  jwt: {
    jwtSecret: process.env.JWT_SECRET,
    saltRound: process.env.BCRYPT_SALT,
  },
  refreshToken: {
    jwtSecret: process.env.REFRESH_SECRET,
  },
  botApiKey: process.env.BOT_API_KEY,
  apiURL: process.env.API_URL + ':' + process.env.PORT,
});
