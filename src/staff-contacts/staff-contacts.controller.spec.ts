import { Test, TestingModule } from '@nestjs/testing';
import { StaffContactsController } from './staff-contacts.controller';
import { StaffContactsService } from './staff-contacts.service';

describe('StaffContactsController', () => {
  let controller: StaffContactsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffContactsController],
      providers: [StaffContactsService],
    }).compile();

    controller = module.get<StaffContactsController>(StaffContactsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
