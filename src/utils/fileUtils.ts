import { BadRequestException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { extname } from 'path';

export const fileFilter = (_req, file, callback) => {
  if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
    return callback(
      new BadRequestException('Only png,jpg,jpeg files are allowed!'),
    );
  }
  callback(null, true);
};

export const editFileName = (_req, file, callback) => {
  const fileExtName = extname(file.originalname);

  const date = new Date().toJSON().slice(0, 10);
  const time = new Date().toLocaleTimeString('th-TH', {
    hour12: false,
    timeZone: 'Asia/Bangkok',
  });

  const dateTime = date + '_' + time.replace(/:/g, '-');

  callback(null, `${dateTime}_${nanoid(5)}${fileExtName}`);
};
