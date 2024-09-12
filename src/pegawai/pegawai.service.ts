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
import * as bcrypt from 'bcrypt';

@Injectable()
export class PegawaiService {
  constructor(
    @InjectRepository(Pegawai)
    private pegawaiRepository: Repository<Pegawai>,
  ) {}

  async createPegawai(createPegawaiDto: CreatePegawaiDto): Promise<Pegawai> {
    try {
      const pegawai = this.pegawaiRepository.create(createPegawaiDto);
      pegawai.password = await bcrypt.hash(createPegawaiDto.password, 10);
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

  findAllPegawai(): Promise<Pegawai[]> {
    return this.pegawaiRepository.find();
  }

  deletePegawai = async (id: number): Promise<void> => {
    const pegawai = await this.pegawaiRepository.findOne({ where: { id } });
    if (!pegawai) {
      throw new NotFoundException(`Pegawai with ID ${id} not found`);
    }

    await this.pegawaiRepository.delete(id);
  };

  async loginPegawai(createPegawaiDto: CreatePegawaiDto): Promise<Pegawai> {
    const { noHpPegawai, password } = createPegawaiDto;
    const pegawai = await this.pegawaiRepository.findOne({
      where: { noHpPegawai },
    });

    if (!pegawai) {
      throw new NotFoundException('Pegawai not found');
    }

    const isPasswordValid = await bcrypt.compare(password, pegawai.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    return pegawai;
  }
}
