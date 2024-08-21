import { Menu } from 'src/menu/menu.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('toping')
export class Toping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  namaToping: string;

  @Column()
  hargaToping: string;

  @CreateDateColumn()
  createdDate: Date;

  @ManyToOne(() => Menu, (menu) => menu.toping)
  menu: Menu;
}
