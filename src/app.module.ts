import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carousel } from 'carousel/entities/carousel.entity';
import { Company } from 'company/entities/company.entity';
import configuration from 'config/configuration';
import { Department } from 'department/entities/department.entity';
import { Division } from 'division/entities/division.entity';
import { Floor } from 'floor/entities/floor.entity';
import { MeetingEvent } from 'meeting-events/entities/meeting-event.entity';
import { LoggerMiddleware } from 'middlewares/logger.middleware';
import { join } from 'path';
import { Post } from 'posts/entities/post.entity';
import { ServiceContactCategory } from 'service-contact-categories/entities/service-contact-categories.entity';
import { ServiceContactCategoryModule } from 'service-contact-categories/service-contact-categories.module';
import { ServiceContact } from 'service-contact/entities/service-contact.entity';
import { ServiceContactModule } from 'service-contact/service-contact.module';
import { Tag } from 'tags/entities/tag.entity';
import { User } from 'users/entities/user.entity';
import { AdminsModule } from './admins/admins.module';
import { Admin } from './admins/entities/admin.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CalendarEventCategoryModule } from './calendar-event-category/calendar-event-category.module';
import { CalendarEventCategory } from './calendar-event-category/entities/calendar-event-category.entity';
import { CalendarEventModule } from './calendar-event/calendar-event.module';
import { CalendarEvent } from './calendar-event/entities/calendar-event.entity';
import { CarouselModule } from './carousel/carousel.module';
import { CompanyModule } from './company/company.module';
import { DepartmentModule } from './department/department.module';
import { DivisionModule } from './division/division.module';
import { FloorModule } from './floor/floor.module';
import { FormsRequestCategory } from './forms-request-categories/entities/forms-request-category.entity';
import { FormsRequestCategoriesModule } from './forms-request-categories/forms-request-categories.module';
import { FormsRequest } from './forms-request/entities/forms-request.entity';
import { FormsRequestModule } from './forms-request/forms-request.module';
import { MeetingEventsModule } from './meeting-events/meeting-events.module';
import { PostCategory } from './post-categories/entities/post-category.entity';
import { PostCategoriesModule } from './post-categories/post-categories.module';
import { PostsModule } from './posts/posts.module';
import { Room } from './rooms/entities/room.entity';
import { RoomsModule } from './rooms/rooms.module';
import { StaffContact } from './staff-contacts/entities/staff-contact.entity';
import { StaffContactsModule } from './staff-contacts/staff-contacts.module';
import { TagsModule } from './tags/tags.module';
import { UploadModule } from './upload/upload.module';
import { UsersModule } from './users/users.module';

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
        synchronize: false,
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
          Floor,
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
    CarouselModule,
    ServiceContactModule,
    ServiceContactCategoryModule,
    FormsRequestModule,
    FormsRequestCategoriesModule,
    DepartmentModule,
    DivisionModule,
    CompanyModule,
    TagsModule,
    FloorModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // Apply to all routes
  }
}
