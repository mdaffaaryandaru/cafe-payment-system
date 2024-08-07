import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Param,
  Put,
  Get,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PegawaiService } from './pegawai.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Pegawai } from './pegawai.entity';
import { CreatePegawaiDto } from './dto/create-pegawai.dto';
import { UpdatePegawaiDto } from './dto/update-pegawai.dto';

@Controller('pegawai')
export class PegawaiController {
  constructor(private readonly pegawaiService: PegawaiService) {}

  @Post('create-pegawai')
  @ApiOperation({ summary: 'Create a new pegawai' })
  @ApiResponse({
    status: 201,
    description: 'The pegawai has been successfully created.',
    type: Pegawai,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({
    description: 'The pegawai to create',
    type: CreatePegawaiDto,
    required: true,
    schema: {
      type: 'object',
      properties: {
        namaPegawai: { type: 'string', example: 'John Doe' },
        alamatPegawai: { type: 'string', example: '123 Main St' },
        noHpPegawai: { type: 'string', example: '08123456789' },
        statusPegawai: { type: 'string', example: 'Active' },
      },
    },
  })
  async createPegawai(
    @Body() createPegawaiDto: CreatePegawaiDto,
  ): Promise<Pegawai> {
    try {
      // Validasi tambahan jika diperlukan
      if (
        !createPegawaiDto.namaPegawai ||
        !createPegawaiDto.alamatPegawai ||
        !createPegawaiDto.noHpPegawai ||
        !createPegawaiDto.statusPegawai
      ) {
        throw new BadRequestException('Missing required fields');
      }
      return await this.pegawaiService.createPegawai(createPegawaiDto);
    } catch (error) {
      console.error('Error creating pegawai:', error);
      throw new BadRequestException('Error creating pegawai');
    }
  }

  @Put('update-pegawai/:id')
  @ApiOperation({ summary: 'Update an existing pegawai' })
  @ApiResponse({
    status: 201,
    description: 'The pegawai has been successfully updated.',
    type: Pegawai,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Pegawai not found.' })
  @ApiBody({
    description: 'The pegawai data to update',
    type: UpdatePegawaiDto,
    required: true,
    schema: {
      type: 'object',
      properties: {
        namaPegawai: { type: 'string', example: 'John Doe' },
        alamatPegawai: { type: 'string', example: '123 Main St' },
        noHpPegawai: { type: 'string', example: '08123456789' },
        statusPegawai: { type: 'string', example: 'Active' },
      },
    },
  })
  async updatePegawai(
    @Param('id') id: number,
    @Body() updatePegawaiDto: UpdatePegawaiDto,
  ): Promise<Pegawai> {
    try {
      // Validasi tambahan jika diperlukan
      if (
        !updatePegawaiDto.namaPegawai ||
        !updatePegawaiDto.alamatPegawai ||
        !updatePegawaiDto.noHpPegawai ||
        !updatePegawaiDto.statusPegawai
      ) {
        throw new BadRequestException('Missing required fields');
      }
      return await this.pegawaiService.updatePegawai(id, updatePegawaiDto);
    } catch (error) {
      console.error('Error updating pegawai:', error);
      throw new BadRequestException('Error updating pegawai');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all pegawai items' })
  @ApiResponse({
    status: 200,
    description: 'All pegawai',
    type: [Pegawai],
  })
  @ApiResponse({ status: 404, description: 'Menu not found.' })
  findAllMenu(): Promise<Pegawai[]> {
    return this.pegawaiService.findAllPegawai();
  }

  @Delete('delete-pegawai/:id')
  @ApiOperation({ summary: 'delete existing id' })
  @ApiResponse({
    status: 200,
    description: 'The menu item has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Pegawai not found.' })
  async deletePegawai(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.pegawaiService.deletePegawai(id);
  }
}
