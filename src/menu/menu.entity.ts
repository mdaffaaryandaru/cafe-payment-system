import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('menu')
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

  
  @CreateDateColumn()
  createdDate: Date;

  @Column({ nullable: true })
  gambarMenu: string;
}
