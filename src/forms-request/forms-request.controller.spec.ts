import { Test, TestingModule } from '@nestjs/testing';
import { FormsRequestController } from './forms-request.controller';
import { FormsRequestService } from './forms-request.service';

describe('FormsRequestController', () => {
  let controller: FormsRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormsRequestController],
      providers: [FormsRequestService],
    }).compile();

    controller = module.get<FormsRequestController>(FormsRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
