import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTopingDto } from './dto/create-toping.dto';

import { UpdateTopingDto } from './dto/update-toping.dto';
import { Toping } from './entities/toping.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TopingService {
  constructor(
    @InjectRepository(Toping)
    private topingRepository: Repository<Toping>,
  ) {}
  async createToping(createTopingDto: CreateTopingDto) {
    try {
      const toping = this.topingRepository.create(createTopingDto);
      return await this.topingRepository.save(toping);
    } catch (error) {
      console.error('Error in createToping service method:', error);
      throw new BadRequestException('Error saving toping');
    }
  }

  findAllToping() {
    return this.topingRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} toping`;
  }

  async updateToping(
    id: number,
    updateTopingDto: UpdateTopingDto,
  ): Promise<Toping> {
    try {
      const toping = await this.topingRepository.findOne({ where: { id } });
      if (!toping) {
        throw new NotFoundException('Toping not found');
      }
      Object.assign(toping, updateTopingDto);
      return await this.topingRepository.save(toping);
    } catch (error) {
      console.error('Error in Toping service method:', error);
      throw new BadRequestException('Error updating toping');
    }
  }

  deleteToping = async (id: number): Promise<void> => {
    const toping = await this.topingRepository.findOne({ where: { id } });
    if (!toping) {
      throw new NotFoundException(`toping with ID ${id} not found`);
    }

    await this.topingRepository.delete(id);
  };
}
