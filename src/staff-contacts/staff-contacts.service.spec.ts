import { Test, TestingModule } from '@nestjs/testing';
import { StaffContactsService } from './staff-contacts.service';

describe('StaffContactsService', () => {
  let service: StaffContactsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaffContactsService],
    }).compile();

    service = module.get<StaffContactsService>(StaffContactsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
