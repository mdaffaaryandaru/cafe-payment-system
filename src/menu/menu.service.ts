import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { Menu } from './menu.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
  ) {}

  async createMenu(createMenuDto: CreateMenuDto): Promise<Menu> {
    try {
      const menu = this.menuRepository.create(createMenuDto);
      return await this.menuRepository.save(menu);
    } catch (error) {
      throw new BadRequestException('Error creating menu');
    }
  }

  findAllMenu(): Promise<Menu[]> {
    return this.menuRepository.find();
  }

  updateMenu = async (
    id: number,
    updateMenuDto: CreateMenuDto,
  ): Promise<Menu> => {
    const menu = await this.menuRepository.findOne({ where: { id } });
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    Object.assign(menu, updateMenuDto);
    return this.menuRepository.save(menu);
  };

  deleteMenu = async (id: number): Promise<void> => {
    const menu = await this.menuRepository.findOne({ where: { id } });
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    await this.menuRepository.delete(id);
  };
}
