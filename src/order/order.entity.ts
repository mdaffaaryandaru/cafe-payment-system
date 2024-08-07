import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { DetailOrderan } from './detail-orderan.entity';

@Entity()
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
}