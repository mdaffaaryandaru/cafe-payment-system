import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { Menu } from './menu.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Toping } from 'src/toping/entities/toping.entity';
import { UpdateMenuDto } from './dto/update-menu';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    @InjectRepository(Toping)
    private topingRepository: Repository<Toping>,
  ) {}

  async createMenu(createMenuDto: CreateMenuDto): Promise<Menu> {
    const { topings, ...menuData } = createMenuDto;
    const menu = this.menuRepository.create(menuData);

    if (topings && topings.length > 0) {
      const topingEntities = await Promise.all(
        topings.map(async (toping) => {
          const topingEntity = this.topingRepository.create({
            namaToping: toping.namaToping,
            hargaToping: Number(toping.hargaToping), // Ensure hargaToping is a number
          });
          return await this.topingRepository.save(topingEntity);
        }),
      );
      menu.topings = topingEntities;
    }

    return this.menuRepository.save(menu);
  }
  findAllMenu(): Promise<Menu[]> {
    return this.menuRepository.find({ relations: ['topings'] });
  }

  async updateMenu(id: number, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    const { topings, ...menuData } = updateMenuDto;
    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: ['topings'],
    });
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    Object.assign(menu, menuData);

    if (topings && topings.length > 0) {
      const existingTopings = menu.topings;

      const updatedTopings = await Promise.all(
        topings.map(async (toping) => {
          if (toping.id) {
            const existingToping = existingTopings.find(
              (t) => t.id === toping.id,
            );
            if (existingToping) {
              Object.assign(existingToping, toping);
              return await this.topingRepository.save(existingToping);
            }
          }
          const newToping = this.topingRepository.create({
            ...toping,
            menu,
          });
          return await this.topingRepository.save(newToping);
        }),
      );

      const topingIds = topings.map((t) => t.id).filter((id) => id);
      const topingsToRemove = existingTopings.filter(
        (t) => !topingIds.includes(t.id),
      );
      await this.topingRepository.remove(topingsToRemove);

      menu.topings = updatedTopings;
    }

    const savedMenu = await this.menuRepository.save(menu);

    savedMenu.topings = savedMenu.topings.map((toping) => {
      const { menu, ...topingWithoutMenu } = toping;
      return topingWithoutMenu;
    });

    return savedMenu;
  }

  //!Belum Delete Bersama Toping
  deleteMenu = async (id: number): Promise<void> => {
    const menu = await this.menuRepository.findOne({ where: { id } });
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    await this.menuRepository.delete(id);
  };
}
