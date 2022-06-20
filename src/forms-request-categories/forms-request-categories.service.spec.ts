import { Test, TestingModule } from '@nestjs/testing';
import { FormsRequestCategoriesService } from './forms-request-categories.service';

describe('FormsRequestCategoriesService', () => {
  let service: FormsRequestCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormsRequestCategoriesService],
    }).compile();

    service = module.get<FormsRequestCategoriesService>(FormsRequestCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
