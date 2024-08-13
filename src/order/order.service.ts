import { BadRequestException, Injectable } from '@nestjs/common';
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

  async create(
    createOrderDto: CreateOrderDto,
    gambarTransaksi: Express.Multer.File,
  ): Promise<Order> {
    const { orderan, ...orderData } = createOrderDto;

    if (gambarTransaksi) {
      // Example: save the file path or URL to the orderData
      orderData.gambarTransaksi = gambarTransaksi.filename; // Adjust based on your storage solution
    }

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

  async findOne(id: number): Promise<Order> {
    return this.orderRepository.findOne({ where: { id } });
  }

  async update(order: Order): Promise<Order> {
    return this.orderRepository.save(order);
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

  async findOrderById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderan'],
    });
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    return order;
  }
}
