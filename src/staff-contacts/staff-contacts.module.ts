import { Module } from '@nestjs/common';
import { StaffContactsService } from './staff-contacts.service';
import { StaffContactsController } from './staff-contacts.controller';
import { StaffContact } from './entities/staff-contact.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { CompanyModule } from 'company/company.module';
import { DivisionModule } from 'division/division.module';
import { DepartmentModule } from 'department/department.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StaffContact]),
    ConfigModule.forRoot({
      load: [configuration],
    }),
    CompanyModule,
    DivisionModule,
    DepartmentModule,
  ],
  controllers: [StaffContactsController],
  providers: [StaffContactsService],
  exports: [StaffContactsService],
})
export class StaffContactsModule {}
