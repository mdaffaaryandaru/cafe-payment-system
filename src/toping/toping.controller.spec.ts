import { Test, TestingModule } from '@nestjs/testing';
import { TopingController } from './toping.controller';
import { TopingService } from './toping.service';

describe('TopingController', () => {
  let controller: TopingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopingController],
      providers: [TopingService],
    }).compile();

    controller = module.get<TopingController>(TopingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
