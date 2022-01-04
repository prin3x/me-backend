import { Module, Post } from '@nestjs/common';
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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      entities: [
        Admin,
        Post,
        Admin,
        CalendarEvent,
        CalendarEventCategory,
        PostCategory,
        Room,
        StaffContact,
      ],
      database: 'db.sqlite',
      synchronize: true,
    }),
    PostsModule,
    AdminsModule,
    AuthModule,
    CalendarEventModule,
    CalendarEventCategoryModule,
    PostCategoriesModule,
    StaffContactsModule,
    RoomsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
