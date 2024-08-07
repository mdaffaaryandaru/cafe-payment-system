import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { DetailOrderan } from './detail-orderan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, DetailOrderan])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
