import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { TopingService } from './toping.service';
import { CreateTopingDto } from './dto/create-toping.dto';
import { UpdateTopingDto } from './dto/update-toping.dto';
import { Toping } from './entities/toping.entity';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('toping')
export class TopingController {
  constructor(private readonly topingService: TopingService) {}

  @Post('create-toping')
  @ApiOperation({ summary: 'Create a new Toping' })
  @ApiResponse({
    status: 201,
    description: 'The Toping has been successfully created.',
    type: Toping,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({
    description: 'The toping to create',
    type: CreateTopingDto,
    required: true,
    schema: {
      type: 'object',
      properties: {
        namaToping: { type: 'string', example: 'Susu' },
        hargaToping: { type: 'string', example: '150000' },
      },
    },
  })
  async createToping(
    @Body() createTopingDto: CreateTopingDto,
  ): Promise<Toping> {
    try {
      if (!createTopingDto.namaToping || !createTopingDto.hargaToping) {
        throw new BadRequestException('Missing required fields');
      }
      return await this.topingService.createToping(createTopingDto);
    } catch (error) {
      console.error('Error creating toping:', error);
      throw new BadRequestException('Error creating toping');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all Toping items' })
  @ApiResponse({
    status: 200,
    description: 'All Toping',
    type: [Toping],
  })
  @ApiResponse({ status: 404, description: 'Toping not found.' })
  findAllMenu(): Promise<Toping[]> {
    return this.topingService.findAllToping();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topingService.findOne(+id);
  }

  @Put('update-toping/:id')
  @ApiOperation({ summary: 'Update an existing toping' })
  @ApiResponse({
    status: 201,
    description: 'The toping has been successfully updated.',
    type: Toping,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Toping not found.' })
  @ApiBody({
    description: 'The toping data to update',
    type: UpdateTopingDto,
    required: true,
    schema: {
      type: 'object',
      properties: {
        namaToping: { type: 'string', example: 'Susu' },
        hargaToping: { type: 'string', example: '150000' },
      },
    },
  })
  async updateToping(
    @Param('id') id: number,
    @Body() updateTopingDto: UpdateTopingDto,
  ): Promise<Toping> {
    try {
      // Validasi tambahan jika diperlukan
      if (!updateTopingDto.namaToping || !updateTopingDto.hargaToping) {
        throw new BadRequestException('Missing required fields');
      }
      return await this.topingService.updateToping(id, updateTopingDto);
    } catch (error) {
      console.error('Error updating Toping:', error);
      throw new BadRequestException('Error updating toping');
    }
  }

  @Delete('delete-toping/:id')
  @ApiOperation({ summary: 'delete existing id' })
  @ApiResponse({
    status: 200,
    description: 'The toping item has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Toping not found.' })
  async deleteToping(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.topingService.deleteToping(id);
  }
}
