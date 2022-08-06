import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { AdminsModule } from './admins/admins.module';
import { AuthModule } from './auth/auth.module';
import { CalendarEventModule } from './calendar-event/calendar-event.module';
import { CalendarEventCategoryModule } from './calendar-event-category/calendar-event-category.module';
import { PostCategoriesModule } from './post-categories/post-categories.module';
import { StaffContactsModule } from './staff-contacts/staff-contacts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsModule } from './rooms/rooms.module';
import { Admin } from './admins/entities/admin.entity';
import { CalendarEvent } from './calendar-event/entities/calendar-event.entity';
import { CalendarEventCategory } from './calendar-event-category/entities/calendar-event-category.entity';
import { PostCategory } from './post-categories/entities/post-category.entity';
import { Room } from './rooms/entities/room.entity';
import { StaffContact } from './staff-contacts/entities/staff-contact.entity';
import { UsersModule } from './users/users.module';
import { User } from 'users/entities/user.entity';
import { Post } from 'posts/entities/post.entity';
import { MeetingEventsModule } from './meeting-events/meeting-events.module';
import { MeetingEvent } from 'meeting-events/entities/meeting-event.entity';
import { S3Service } from 's3/s3.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'config/configuration';
import { ScheduleModule } from '@nestjs/schedule';
import { Carousel } from 'carousel/entities/carousel.entity';
import { CarouselModule } from './carousel/carousel.module';
import { ServiceContact } from 'service-contact/entities/service-contact.entity';
import { ServiceContactCategory } from 'service-contact-categories/entities/service-contact-categories.entity';
import { ServiceContactModule } from 'service-contact/service-contact.module';
import { ServiceContactCategoryModule } from 'service-contact-categories/service-contact-categories.module';
import { FormsRequestCategoriesModule } from './forms-request-categories/forms-request-categories.module';
import { FormsRequestModule } from './forms-request/forms-request.module';
import { FormsRequest } from './forms-request/entities/forms-request.entity';
import { FormsRequestCategory } from './forms-request-categories/entities/forms-request-category.entity';
import { DepartmentModule } from './department/department.module';
import { DivisionModule } from './division/division.module';
import { CompanyModule } from './company/company.module';
import { TagsModule } from './tags/tags.module';
import { Company } from 'company/entities/company.entity';
import { Department } from 'department/entities/department.entity';
import { Division } from 'division/entities/division.entity';
import { Tag } from 'tags/entities/tag.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [
        ServeStaticModule.forRoot({
          rootPath: join(__dirname, '..', 'upload'),
        }),
        ConfigModule,
      ],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        timezone: 'Z',
        synchronize: true,
        entities: [
          Admin,
          Post,
          Admin,
          CalendarEvent,
          CalendarEventCategory,
          PostCategory,
          Room,
          StaffContact,
          User,
          MeetingEvent,
          Carousel,
          ServiceContact,
          ServiceContactCategory,
          FormsRequest,
          FormsRequestCategory,
          Company,
          Department,
          Division,
          Tag,
        ],
      }),
    }),
    PostsModule,
    AdminsModule,
    AuthModule,
    CalendarEventModule,
    CalendarEventCategoryModule,
    PostsModule,
    PostCategoriesModule,
    StaffContactsModule,
    RoomsModule,
    UsersModule,
    MeetingEventsModule,
    S3Service,
    CarouselModule,
    ServiceContactModule,
    ServiceContactCategoryModule,
    FormsRequestModule,
    FormsRequestCategoriesModule,
    DepartmentModule,
    DivisionModule,
    CompanyModule,
    TagsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
