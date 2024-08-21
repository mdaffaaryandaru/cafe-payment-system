import { Toping } from 'src/toping/entities/toping.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  OneToMany,
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

  @OneToMany(() => Toping, (toping) => toping.menu, { cascade: true })
  @JoinColumn()
  topings: Toping[];
}
