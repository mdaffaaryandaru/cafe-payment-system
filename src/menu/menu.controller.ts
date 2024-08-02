import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateMenuDto } from './dto/create-menu.dto';
import { MenuService } from './menu.service';
import { Menu } from './menu.entity';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { UpdateMenuDto } from './dto/update-menu';

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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('gambarMenu', {
      limits: { fileSize: 10 * 1024 * 1024 }, // Set file size limit if needed
    }),
  )
  async createMenu(
    @Body() createMenuDto: CreateMenuDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Menu> {
    console.log('Endpoint hit'); // Log pertama
    try {
      if (file) {
        createMenuDto.gambarMenu = file.filename;
        console.log('File received:', file); // Log kedua
      } else {
        console.log('No file received'); // Log ketiga
      }
      // Validasi tambahan jika diperlukan
      if (
        !createMenuDto.namaMenu ||
        !createMenuDto.stokMenu ||
        !createMenuDto.kategoriMenu ||
        !createMenuDto.hargaMenu
      ) {
        throw new BadRequestException('Missing required fields');
      }
      return await this.menuService.createMenu(createMenuDto);
    } catch (error) {
      console.error('Error creating menu:', error); // Log keempat
      throw new BadRequestException('Error creating menu');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all menu items' })
  @ApiResponse({
    status: 200,
    description: 'All menu',
    type: [Menu],
  })
  @ApiResponse({ status: 404, description: 'Menu not found.' })
  findAllMenu(): Promise<Menu[]> {
    return this.menuService.findAllMenu();
  }

  @Put('edit-menu/:id')
  @ApiOperation({ summary: 'Update an existing menu item' })
  @ApiResponse({
    status: 201,
    description: 'The menu item has been successfully updated.',
    type: Menu,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Menu item not found.' })
  @ApiBody({
    description: 'The menu item to update',
    type: UpdateMenuDto,
    examples: {
      example1: {
        summary: 'Example menu item update',
        description: 'An example of a menu item to be updated',
        value: {
          namaMenu: 'Nasi Goreng Updated',
          stokMenu: 15,
          kategoriMenu: 'Makanan',
          hargaMenu: '20000',
        },
      },
    },
  })
  async updateMenu(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuDto: UpdateMenuDto,
  ): Promise<Menu> {
    return this.menuService.updateMenu(id, updateMenuDto);
  }

  @Delete('delete-menu/:id')
  @ApiOperation({ summary: 'delete existing id' })
  @ApiResponse({
    status: 200,
    description: 'The menu item has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Menu item not found.' })
  async deleteMenu(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.menuService.deleteMenu(id);
  }
}
