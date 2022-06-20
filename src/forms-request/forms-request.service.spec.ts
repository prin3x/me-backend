import { Test, TestingModule } from '@nestjs/testing';
import { FormsRequestService } from './forms-request.service';

describe('FormsRequestService', () => {
  let service: FormsRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormsRequestService],
    }).compile();

    service = module.get<FormsRequestService>(FormsRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
