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
    const { topings = [], ...menuData } = createMenuDto;
    const menu = this.menuRepository.create(menuData);

    if (topings.length > 0) {
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
    } else {
      menu.topings = []; // Ensure topings is an empty array if none are provided
    }

    const savedMenu = await this.menuRepository.save(menu);

    // Fetch the menu with its topings relations
    const menuWithTopings = await this.menuRepository.findOne({
      where: { id: savedMenu.id },
      relations: ['topings'],
    });

    return menuWithTopings;
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

    // Ensure the topings are correctly associated with the menu
    if (menu.topings.length > 0) {
      savedMenu.topings = await this.topingRepository.find({
        where: { menu: savedMenu },
      });
    }

    // Reload the menu to ensure all relations are loaded
    const updatedMenu = await this.menuRepository.findOne({
      where: { id: savedMenu.id },
      relations: ['topings'],
    });

    return updatedMenu;
  }

  //!Belum Delete Bersama Toping
  async deleteMenu(id: number): Promise<void> {
    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: ['topings'],
    });

    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    // Hapus semua toping yang berelasi dengan menu
    if (menu.topings && menu.topings.length > 0) {
      await this.topingRepository.remove(menu.topings);
    }

    // Hapus menu
    await this.menuRepository.delete(id);
  }
}
