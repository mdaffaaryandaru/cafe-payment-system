import { Module } from '@nestjs/common';
import { TopingService } from './toping.service';
import { TopingController } from './toping.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Toping } from './entities/toping.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Toping])],
  controllers: [TopingController],
  providers: [TopingService],
})
export class TopingModule {}
