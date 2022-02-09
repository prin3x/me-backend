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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
