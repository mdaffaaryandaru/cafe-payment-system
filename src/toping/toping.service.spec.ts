import { Test, TestingModule } from '@nestjs/testing';
import { TopingService } from './toping.service';

describe('TopingService', () => {
  let service: TopingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopingService],
    }).compile();

    service = module.get<TopingService>(TopingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
