import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { DetailOrderan } from './detail-orderan.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(DetailOrderan)
    private readonly detailOrderanRepository: Repository<DetailOrderan>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { orderan, ...orderData } = createOrderDto;

    // Create the order entity
    const order = this.orderRepository.create(orderData);

    // Create the detail orderan entities
    const detailOrderanEntities = orderan.map((detail) => {
      const detailOrderan = this.detailOrderanRepository.create(detail);
      detailOrderan.order = order; // Set the order reference
      return detailOrderan;
    });

    // Save the order and detail orderan entities
    await this.orderRepository.save(order);
    await this.detailOrderanRepository.save(detailOrderanEntities);

    // Return the saved order with detail orderan
    return this.orderRepository.findOne({
      where: { id: order.id },
      relations: ['orderan'],
    });
  }

  async findAllOrder(): Promise<Order[]> {
    const orders = await this.orderRepository.find({
      relations: ['orderan'],
    });

    return orders.map((order) => {
      const totalHarga = order.orderan.reduce(
        (total, item) => total + item.jumlah * item.harga,
        0,
      );
      return {
        ...order,
        totalHarga,
      };
    });
  }
}
