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
  //Deklarasi id sebagai primary key
  @PrimaryGeneratedColumn()
  id: number;
  //Deklarasi namaMenu
  @Column()
  namaMenu: string;
  //Deklarasi stokMenu
  @Column()
  stokMenu: number;
  //Deklarasi kategoriMenu
  @Column()
  kategoriMenu: string;
  //Deklarasi hargaMenu
  @Column()
  hargaMenu: string;
  //Deklarasi createdDate
  @CreateDateColumn()
  createdDate: Date;
  //Deklarasi gambarMenu
  @Column({ nullable: true })
  gambarMenu: string;
  //Deklarasi topings
  @OneToMany(() => Toping, (toping) => toping.menu, { cascade: true })
  @JoinColumn()
  topings: Toping[];
}
