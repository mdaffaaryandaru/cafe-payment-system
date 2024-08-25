import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Menu } from '../menu/menu.entity';

@Entity('detail_orderan')
export class DetailOrderan {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.orderan)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  orderId: number;

  @ManyToOne(() => Menu)
  @JoinColumn({ name: 'menuId' })
  menu: Menu;

  @Column()
  menuId: number;

  @Column()
  jumlah: number;

  @Column()
  harga: number;

  @Column('simple-array', { nullable: true })
  topping: string[];

  @CreateDateColumn()
  createdDate: Date;
}
