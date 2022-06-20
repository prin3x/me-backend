import { Test, TestingModule } from '@nestjs/testing';
import { FormsRequestCategoriesController } from './forms-request-categories.controller';
import { FormsRequestCategoriesService } from './forms-request-categories.service';

describe('FormsRequestCategoriesController', () => {
  let controller: FormsRequestCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormsRequestCategoriesController],
      providers: [FormsRequestCategoriesService],
    }).compile();

    controller = module.get<FormsRequestCategoriesController>(FormsRequestCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
