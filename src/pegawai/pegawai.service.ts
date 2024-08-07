import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePegawaiDto } from './dto/create-pegawai.dto';
import { Pegawai } from './pegawai.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdatePegawaiDto } from './dto/update-pegawai.dto';

@Injectable()
export class PegawaiService {
  constructor(
    @InjectRepository(Pegawai)
    private pegawaiRepository: Repository<Pegawai>,
  ) {}

  async createPegawai(createPegawaiDto: CreatePegawaiDto): Promise<Pegawai> {
    try {
      const pegawai = this.pegawaiRepository.create(createPegawaiDto);
      return await this.pegawaiRepository.save(pegawai);
    } catch (error) {
      console.error('Error in createPegawai service method:', error);
      throw new BadRequestException('Error saving pegawai');
    }
  }

  async updatePegawai(
    id: number,
    updatePegawaiDto: UpdatePegawaiDto,
  ): Promise<Pegawai> {
    try {
      const pegawai = await this.pegawaiRepository.findOne({ where: { id } });
      if (!pegawai) {
        throw new NotFoundException('Pegawai not found');
      }
      Object.assign(pegawai, updatePegawaiDto);
      return await this.pegawaiRepository.save(pegawai);
    } catch (error) {
      console.error('Error in updatePegawai service method:', error);
      throw new BadRequestException('Error updating pegawai');
    }
  }
}
