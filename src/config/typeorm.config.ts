import { readFileSync } from 'fs';
import { resolve } from 'path';
import { DataSource } from 'typeorm';
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

try {
  for (const line of readFileSync(resolve(process.cwd(), '.env'), 'utf8').split(
    '\n',
  )) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq);
    const val = trimmed.slice(eq + 1);
    if (process.env[key] === undefined) process.env[key] = val;
  }
} catch {
  // env already set in process
}

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
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
  synchronize: false,
  logging: true,
});
