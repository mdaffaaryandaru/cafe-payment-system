import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { DetailOrderan } from './detail-orderan.entity';
import { Menu } from 'src/menu/menu.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(DetailOrderan)
    private readonly detailOrderanRepository: Repository<DetailOrderan>,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    gambarTransaksi: Express.Multer.File,
  ): Promise<Order> {
    const { orderan, ...orderData } = createOrderDto;

    if (gambarTransaksi) {
      orderData.gambarTransaksi = gambarTransaksi.filename;
    }

    const order = this.orderRepository.create(orderData);

    const detailOrderanEntities = await Promise.all(
      orderan.map(async (detail) => {
        const detailOrderan = this.detailOrderanRepository.create(detail);
        detailOrderan.order = order;

        const menu = await this.menuRepository.findOne({
          where: { id: detail.menuId },
          relations: ['topings'],
        });

        if (menu) {
          detailOrderan.menu = menu;
        }

        return detailOrderan;
      }),
    );

    await this.orderRepository.save(order);
    await this.detailOrderanRepository.save(detailOrderanEntities);

    const savedOrder = await this.orderRepository.findOne({
      where: { id: order.id },
      relations: ['orderan', 'orderan.menu.topings'],
    });

    const transformedOrder = {
      ...savedOrder,
      orderan: savedOrder.orderan.map((detail) => ({
        ...detail,
        topings: detail.menu.topings,
        menu: undefined,
      })),
    };
    return transformedOrder as Order;
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderan', 'orderan.menu.topings'],
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    const transformedOrder = {
      ...order,
      orderan: order.orderan.map((detail) => ({
        ...detail,
        topings: detail.menu.topings,
        menu: undefined,
      })),
    };

    return transformedOrder as Order;
  }

  async update(order: Order): Promise<Order> {
    return this.orderRepository.save(order);
  }

  async findAllOrder(): Promise<Order[]> {
    const orders = await this.orderRepository.find({
      relations: ['orderan', 'orderan.menu.topings'],
    });

    return orders.map((order) => ({
      ...order,
      orderan: order.orderan.map((detail) => ({
        ...detail,
        topings: detail.menu.topings,
        menu: undefined,
      })),
    }));
  }

  async findOrderById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderan', 'orderan.menu.topings'],
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    const transformedOrder = {
      ...order,
      orderan: order.orderan.map((detail) => ({
        ...detail,
        topings: detail.menu.topings,
        menu: undefined,
      })),
    };

    return transformedOrder as Order;
  }
}
