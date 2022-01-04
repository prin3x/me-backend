import { Test, TestingModule } from '@nestjs/testing';
import { CalendarEventCategoryController } from './calendar-event-category.controller';
import { CalendarEventCategoryService } from './calendar-event-category.service';

describe('CalendarEventCategoryController', () => {
  let controller: CalendarEventCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalendarEventCategoryController],
      providers: [CalendarEventCategoryService],
    }).compile();

    controller = module.get<CalendarEventCategoryController>(CalendarEventCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
