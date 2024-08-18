import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('pegawai')
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

  @CreateDateColumn()
  createdDate: Date;
}
