import { Test, TestingModule } from '@nestjs/testing';
import { CalendarEventCategoryService } from './calendar-event-category.service';

describe('CalendarEventCategoryService', () => {
  let service: CalendarEventCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalendarEventCategoryService],
    }).compile();

    service = module.get<CalendarEventCategoryService>(CalendarEventCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
