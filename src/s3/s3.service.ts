import { Injectable, BadRequestException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import * as mime from 'mime-types';

// --- Load Config
import * as path from 'path';

@Injectable()
export class S3Service {
  private s3: any;

  // TODO: Constructor
  constructor(private config: ConfigService) {
    console.log(this.config.get('s3.awsS3BucketName'));
    this.s3 = new AWS.S3({
      accessKeyId: this.config.get('s3.awsAccessKeyID'),
      secretAccessKey: this.config.get('s3.awsSecretAccessKeyID'),
      region: 'ap-southeast-1',
      // endpoint: this.config.get('S3_ENDPOINT'),
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    });
  }

  async putObject(key: string, file: Buffer, acl = 'private') {
    return await this.s3
      .putObject({
        Bucket: this.config.get('s3.awsS3BucketName'),
        Key: key,
        Body: file,
      })
      .promise()
      .catch((error: any) => {
        console.log(error.message);
      });
  }

  // TODO: getObject (Get file from S3)
  async getObject(key: string) {
    const params = { Bucket: this.config.get('s3.awsS3BucketName'), Key: key };
    return this.s3.getObject(params).createReadStream();
  }

  // TODO: getObjectData (Get file from S3)
  async getObjectData(key: string) {
    const params = { Bucket: this.config.get('s3.awsS3BucketName'), Key: key };

    return new Promise((resolve, reject) => {
      this.s3.getObject(params, (err, data) => {
        if (err) reject(err.code);
        if (data) resolve(Buffer.from(data.Body).toString('utf8'));
      });
    });
  }

  // TODO: getS3Url (Get URL S3)
  async getS3Url(key: string): Promise<string> {
    const params = { Bucket: this.config.get('s3.awsS3BucketName'), Key: key };
    const url = await this.s3.getSignedUrlPromise('getObject', params);
    return url;
  }

  // TODO: uploadImagesS3 (Upload to S3)
  async uploadImagesS3(images) {
    const todayDate = new Date().toISOString().slice(0, 10);
    const nameImage = todayDate;
    const randomNumber = Date.now();

    images.originalname =
      nameImage + '-' + randomNumber + mime.extension(images.mimetype);
    const key = images.originalname;
    await this.putObject(key, images.buffer, 'public-read');
    return `${key}`;
  }

  async deleteDir(prefix) {
    const params = {
      Bucket: this.config.get('s3.awsS3BucketName'),
      Prefix: prefix,
    };
    const listedObjects = await this.s3.listObjectsV2(params).promise();

    if (listedObjects.Contents.length === 0) return;

    const deleteParams = {
      Bucket: this.config.get('s3.awsS3BucketName'),
      Delete: { Objects: [] as any },
    };

    listedObjects.Contents.forEach((content: any) => {
      deleteParams.Delete.Objects.push({ Key: content.Key });
    });

    await this.s3.deleteObjects(deleteParams).promise();

    if (listedObjects.IsTruncated) await this.deleteDir(prefix);
  }

  // TODO: deleteObject (Delete file S3)
  async deleteObject(pathfileS3: string) {
    const params = {
      Bucket: this.config.get('s3.awsS3BucketName'),
      Key: pathfileS3,
    };

    await this.s3.deleteObject(params, function (err, data) {
      if (err) console.log(err, err.stack);
      // an error occurred
      else console.log(data); // successful response
    });
  }

  // TODO: copyObject (Copy file S3 old->new and Delete ?)
  async copyObject(pathOld: string, pathDes: string, deleteToo = false) {
    const bucketName = this.config.get('s3.awsS3BucketName');
    const params = {
      Bucket: bucketName,
      CopySource: `/${bucketName}/${pathOld}`,
      Key: `${pathDes}`,
      ACL: 'private',
    };

    return await this.s3
      .copyObject(params, (err, data) => {
        if (err) console.log('err', err);
        // an error occurred
        else {
          if (deleteToo) this.deleteObject(pathOld);

          return data;
        }
      })
      .promise();
  }
}
