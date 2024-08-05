import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { PegawaiService } from './pegawai.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Pegawai } from './pegawai.entity';
import { CreatePegawaiDto } from './dto/create-pegawai.dto';

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
}
