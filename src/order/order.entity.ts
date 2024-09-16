import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { DetailOrderan } from './detail-orderan.entity';

@Entity('order_pelanggan')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  noMeja: number;

  @Column()
  namaPelanggan: string;

  @Column()
  statusPesanan: string;

  @Column()
  jenisPembayaran: string;

  @OneToMany(() => DetailOrderan, (detailOrderan) => detailOrderan.order, {
    cascade: true,
  })
  orderan: DetailOrderan[];

  @Column()
  totalHarga: number;

  @CreateDateColumn()
  createdDate: Date;

  @Column({ nullable: true })
  gambarTransaksi: string;

  @Column({ nullable: true })
  pegawai: string;
}
