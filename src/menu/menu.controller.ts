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
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateMenuDto } from './dto/create-menu.dto';
import { Response } from 'express'; // Pastikan impor dari 'express'
import { MenuService } from './menu.service';
import { Menu } from './menu.entity';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { UpdateMenuDto } from './dto/update-menu';
import { join } from 'path';

@Controller('menu')
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
  ) {}

  @Post('create-menu')
  @ApiOperation({ summary: 'Create a new menu item' })
  @ApiResponse({
    status: 201,
    description: 'The menu item has been successfully created.',
    type: Menu,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'The menu item to create',
    type: CreateMenuDto,
    required: true,
    schema: {
      type: 'object',
      properties: {
        namaMenu: { type: 'string', example: 'Nasi Goreng' },
        kategoriMenu: { type: 'string', example: 'Makanan' },
        stokMenu: { type: 'number', example: 10 },
        hargaMenu: { type: 'string', example: '15000' },
        gambarMenu: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('gambarMenu'))
  async createMenu(
    @UploadedFile() gambarMenu,
    @Body() createMenuDto: CreateMenuDto,
  ): Promise<Menu> {
    try {
      if (gambarMenu) {
        createMenuDto.gambarMenu = gambarMenu.filename;
      } 
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
      throw new BadRequestException('Error creating menu');
    }
  }

  @Put('edit-menu/:id')
  @ApiOperation({ summary: 'Edit an existing menu item' })
  @ApiResponse({
    status: 200,
    description: 'The menu item has been successfully updated.',
    type: Menu,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'The menu item to update',
    type: UpdateMenuDto,
    required: true,
    schema: {
      type: 'object',
      properties: {
        namaMenu: { type: 'string', example: 'Nasi Goreng' },
        kategoriMenu: { type: 'string', example: 'Makanan' },
        stokMenu: { type: 'number', example: 10 },
        hargaMenu: { type: 'string', example: '15000' },
        gambarMenu: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('gambarMenu'))
  async editMenu(
    @Param('id') id: number,
    @UploadedFile() gambarMenu,
    @Body() updateMenuDto: UpdateMenuDto,
  ): Promise<Menu> {
    try {
      if (gambarMenu) {
        updateMenuDto.gambarMenu = gambarMenu.filename;
      } 
      // Validasi tambahan jika diperlukan
      if (
        !updateMenuDto.namaMenu ||
        !updateMenuDto.stokMenu ||
        !updateMenuDto.kategoriMenu ||
        !updateMenuDto.hargaMenu
      ) {
        throw new BadRequestException('Missing required fields');
      }
      return await this.menuService.updateMenu(id, updateMenuDto);
    } catch (error) {
      throw new BadRequestException('Error updating menu');
    }
  }

  @Get('images/:imageName')
  getImage(@Param('imageName') imageName: string, @Res() res: Response) {
    const imagePath = join(__dirname, '..', '..', 'files', imageName);
    return res.sendFile(imagePath);
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
