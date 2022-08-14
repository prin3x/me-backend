import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { StaffContactsService } from './staff-contacts.service';
import { StaffContactsController } from './staff-contacts.controller';
import { StaffContact } from './entities/staff-contact.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { CompanyModule } from 'company/company.module';
import { DivisionModule } from 'division/division.module';
import { DepartmentModule } from 'department/department.module';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';

@Module({
  imports: [
    TypeOrmModule.forFeature([StaffContact]),
    CompanyModule,
    DivisionModule,
    DepartmentModule,
    MulterModule.registerAsync({
      useFactory: () => ({
        fileFilter: (req: any, file: any, cb: any) => {
          if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            // Allow storage of file
            cb(null, true);
          } else {
            // Reject file
            cb(
              new HttpException(
                `Unsupported file type ${extname(file.originalname)}`,
                HttpStatus.BAD_REQUEST,
              ),
              false,
            );
          }
        },
        limits: {
          fileSize: +10 * 1024 * 1024,
        },
        storage: diskStorage({
          destination: './upload/staffprofile',
          filename: (req: any, file: any, cb: any) => {
            cb(null, `${uuid()}${extname(file.originalname)}`);
          },
        }),
      }),
    }),
  ],
  controllers: [StaffContactsController],
  providers: [StaffContactsService],
  exports: [StaffContactsService],
})
export class StaffContactsModule {}
