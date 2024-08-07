import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Param,
  Put,
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
}
