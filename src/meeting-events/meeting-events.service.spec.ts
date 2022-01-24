import { Test, TestingModule } from '@nestjs/testing';
import { MeetingEventsService } from './meeting-events.service';

describe('MeetingEventsService', () => {
  let service: MeetingEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeetingEventsService],
    }).compile();

    service = module.get<MeetingEventsService>(MeetingEventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
