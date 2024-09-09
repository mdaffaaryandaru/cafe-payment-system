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
//Controller untuk menu yang berisi endpoint-endpoint yang berhubungan dengan menu
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}
  //Fungsi untuk membuat menu baru
  @Post('create-menu')
  @ApiOperation({ summary: 'Create a new menu item' })
  @ApiResponse({
    //Respon jika berhasil
    status: 201,
    //Deskripsi respon
    description: 'The menu item has been successfully created.',
    //Tipe data respon
    type: Menu,
  })
  //Respon jika gagal
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  //Menggunakan multipart/form-data
  @ApiConsumes('multipart/form-data')
  //Body request
  @ApiBody({
    //Deskripsi body request
    description: 'The menu item to create',
    //Tipe data body request
    type: CreateMenuDto,
    //Wajib diisi
    required: true,
    //Schema body request
    schema: {
      //Tipe data object
      type: 'object',
      //Properti-properti object
      properties: {
        //Properti namaMenu
        namaMenu: { type: 'string', example: 'Nasi Goreng' },
        //Properti kategoriMenu
        kategoriMenu: { type: 'string', example: 'Makanan' },
        //Properti stokMenu
        stokMenu: { type: 'number', example: 10 },
        // Properti hargaMenu
        hargaMenu: { type: 'string', example: '15000' },
        //Properti gambarMenu
        gambarMenu: {
          type: 'string',
          format: 'binary',
        },
        //Properti topings
        topings: {
          type: 'array',
          items: { $ref: '../menu/dto/create-menu.dto.ts' },
        },
      },
    },
  })
  //Menggunakan FileInterceptor dengan nama 'gambarMenu'
  @UseInterceptors(FileInterceptor('gambarMenu'))
  //Fungsi createMenu
  async createMenu(
    //Parameter pertama adalah file gambarMenu
    @UploadedFile() gambarMenu,
    //Parameter kedua adalah body request createMenuDto
    @Body() createMenuDto: CreateMenuDto,
    //Mengembalikan promise menu
  ): Promise<Menu> {
    try {
      console.log('Incoming createMenuDto:', createMenuDto);
      console.log('Incoming gambarMenu:', gambarMenu);
      //Jika gambarMenu ada maka createMenuDto.gambarMenu diisi dengan nama file gambarMenu
      if (gambarMenu) {
        createMenuDto.gambarMenu = gambarMenu.filename;
      }
      //Validasi tambahan jika diperlukan jika ada field yang kosong maka throw BadRequestException
      if (
        !createMenuDto.namaMenu ||
        !createMenuDto.stokMenu ||
        !createMenuDto.kategoriMenu ||
        !createMenuDto.hargaMenu
      ) {
        throw new BadRequestException('Missing required fields');
      }
      //Mengembalikan menu yang telah dibuat
      const createdMenu = await this.menuService.createMenu(createMenuDto);
      //Log menu yang telah dibuat
      console.log('Created menu:', createdMenu);
      //Mengembalikan menu yang telah dibuat
      return createdMenu;
    } catch (error) {
      console.error('Error creating menu:', error);
      throw new BadRequestException('Error creating menu');
    }
  }
  //Fungsi untuk mengedit menu
  @Put('edit-menu/:id')
  //Deskripsi endpoint
  @ApiOperation({ summary: 'Edit an existing menu item' })
  //Respon jika berhasil
  @ApiResponse({
    //Status respon
    status: 200,
    //Deskripsi respon
    description: 'The menu item has been successfully updated.',
    //Tipe data respon
    type: Menu,
  })
  //Respon jika gagal
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  //Menggunakan multipart/form-data
  @ApiConsumes('multipart/form-data')
  //Body request
  @ApiBody({
    //Deskripsi body request
    description: 'The menu item to update',
    //Tipe data body request
    type: UpdateMenuDto,
    //Wajib diisi
    required: true,
    //Schema body request
    schema: {
      //Tipe data object
      type: 'object',
      //Properti-properti object
      properties: {
        //Properti namaMenu
        namaMenu: { type: 'string', example: 'Nasi Goreng' },
        //  Properti kategoriMenu
        kategoriMenu: { type: 'string', example: 'Makanan' },
        //Properti stokMenu
        stokMenu: { type: 'number', example: 10 },
        //Properti hargaMenu
        hargaMenu: { type: 'string', example: '15000' },
        //Properti gambarMenu
        gambarMenu: {
          type: 'string',
          format: 'binary',
        },
        //Properti topings
        topings: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              namaToping: { type: 'string', example: 'Keju' },
              hargaToping: { type: 'number', example: 5000 },
            },
          },
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('gambarMenu'))
  //Fungsi editMenu
  async editMenu(
    //Parameter pertama adalah id
    @Param('id') id: number,
    //Parameter kedua adalah file gambarMenu
    @UploadedFile() gambarMenu,
    //Parameter ketiga adalah body request updateMenuDto
    @Body() updateMenuDto: UpdateMenuDto,
    //Mengembalikan promise menu
  ): Promise<Menu> {
    //Coba jalankan kode berikut
    try {
      //Log updateMenuDto
      if (gambarMenu) {
        //Jika gambarMenu ada maka updateMenuDto.gambarMenu diisi dengan nama file gambarMenu
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
      //Mengembalikan menu yang telah diupdate
      return await this.menuService.updateMenu(id, updateMenuDto);
    } catch (error) {
      throw new BadRequestException('Error updating menu');
    }
  }
  //Fungsi untuk mendapatkan gambar
  @Get('images/:imageName')
  getImage(@Param('imageName') imageName: string, @Res() res: Response) {
    //Mengembalikan gambar dengan nama imageName dari folder files
    const imagePath = join(__dirname, '..', '..', 'files', imageName);
    //Mengembalikan gambar
    return res.sendFile(imagePath);
  }
  //Fungsi untuk mendapatkan semua menu
  @Get()
  //Deskripsi endpoint
  @ApiOperation({ summary: 'Get all menu items' })
  //Respon jika berhasil
  @ApiResponse({
    //Status respon
    status: 200,
    //Deskripsi respon
    description: 'All menu',
    //Tipe data respon
    type: [Menu],
  })
  //Respon jika gagal
  @ApiResponse({ status: 404, description: 'Menu not found.' })
  //Fungsi Mengambil semua menu
  findAllMenu(): Promise<Menu[]> {
    //Mengembalikan semua menu
    return this.menuService.findAllMenu();
  }
  //Fungsi untuk mendapatkan menu berdasarkan id
  @Delete('delete-menu/:id')
  //Deskripsi endpoint
  @ApiOperation({ summary: 'delete existing id' })
  //Respon jika berhasil
  @ApiResponse({
    //Status respon
    status: 200,
    //Deskripsi respon
    description: 'The menu item has been successfully deleted.',
  })
  //Respon jika gagal
  @ApiResponse({ status: 404, description: 'Menu item not found.' })
  //Fungsi deleteMenu
  async deleteMenu(@Param('id', ParseIntPipe) id: number): Promise<void> {
    //Mengembalikan promise deleteMenu
    return this.menuService.deleteMenu(id);
  }
}
