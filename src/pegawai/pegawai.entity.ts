import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pegawai {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  namaPegawai: string;

  @Column()
  alamatPegawai: string;

  @Column()
  noHpPegawai: string;

  @Column()
  statusPegawai: string;


}
