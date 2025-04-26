import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Admin } from '../admins/entities/admin.entity';
import { Post } from '../posts/entities/post.entity';
import { CalendarEvent } from '../calendar-event/entities/calendar-event.entity';
import { CalendarEventCategory } from '../calendar-event-category/entities/calendar-event-category.entity';
import { PostCategory } from '../post-categories/entities/post-category.entity';
import { Room } from '../rooms/entities/room.entity';
import { StaffContact } from '../staff-contacts/entities/staff-contact.entity';
import { User } from '../users/entities/user.entity';
import { MeetingEvent } from '../meeting-events/entities/meeting-event.entity';
import { Carousel } from '../carousel/entities/carousel.entity';
import { ServiceContact } from '../service-contact/entities/service-contact.entity';
import { ServiceContactCategory } from '../service-contact-categories/entities/service-contact-categories.entity';
import { FormsRequest } from '../forms-request/entities/forms-request.entity';
import { FormsRequestCategory } from '../forms-request-categories/entities/forms-request-category.entity';
import { Company } from '../company/entities/company.entity';
import { Department } from '../department/entities/department.entity';
import { Division } from '../division/entities/division.entity';
import { Tag } from '../tags/entities/tag.entity';
import { Floor } from '../floor/entities/floor.entity';

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: configService.get('database.host'),
  port: configService.get('database.port'),
  username: configService.get('database.user'),
  password: configService.get('database.password'),
  database: configService.get('database.database'),
  entities: [
    Admin,
    Post,
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
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: true,
  logging: true,
});
