import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateMenuDto } from './dto/create-menu.dto';
import { Menu } from './menu.entity';
import { MenuService } from './menu.service';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('create-menu')
  @ApiOperation({ summary: 'Create a new menu item' })
  @ApiResponse({
    status: 201,
    description: 'The menu item has been successfully created.',
    type: Menu,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({
    description: 'The menu item to create',
    type: CreateMenuDto,
    examples: {
      example1: {
        summary: 'Example menu item',
        description: 'An example of a menu item to be created',
        value: {
          namaMenu: 'Nasi Goreng',
          stokMenu: 10,
          kategoriMenu: 'Makanan',
          hargaMenu: '15000',
        },
      },
    },
  })
  createMenu(@Body() createMenuDto: CreateMenuDto): Promise<Menu> {
    return this.menuService.createMenu(createMenuDto);
  }
}
