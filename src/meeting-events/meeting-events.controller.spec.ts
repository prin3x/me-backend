import { Test, TestingModule } from '@nestjs/testing';
import { MeetingEventsController } from './meeting-events.controller';
import { MeetingEventsService } from './meeting-events.service';

describe('MeetingEventsController', () => {
  let controller: MeetingEventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeetingEventsController],
      providers: [MeetingEventsService],
    }).compile();

    controller = module.get<MeetingEventsController>(MeetingEventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
