import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  namaMenu: string;

  @Column()
  stokMenu: number;

  @Column()
  kategoriMenu: string;

  @Column()
  hargaMenu: string;
}
