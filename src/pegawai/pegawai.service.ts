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
    const { password, ...rest } = createPegawaiDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const pegawai = this.pegawaiRepository.create({
      ...rest,
      password: hashedPassword,
    });
    return this.pegawaiRepository.save(pegawai);
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
  async verifyPassword(createPegawaiDto: CreatePegawaiDto): Promise<boolean> {
    const { pegawaiId, password } = createPegawaiDto;
    const pegawai = await this.pegawaiRepository.findOne({
      where: { id: pegawaiId },
    });

    if (!pegawai) {
      throw new NotFoundException('Pegawai not found');
    }

    console.log(`Verifying password for: ${pegawai.namaPegawai}`);
    console.log(`Stored password hash: ${pegawai.password}`);
    console.log(`Provided password: ${password}`);

    // Check if the provided password is not empty
    if (!password) {
      console.log('Provided password is empty');
      return false;
    }

    // Check if the stored password hash is not empty
    if (!pegawai.password) {
      console.log('Stored password hash is empty');
      return false;
    }

    const isPasswordValid = await bcrypt.compare(password, pegawai.password);
    console.log(`Password valid: ${isPasswordValid}`);
    return isPasswordValid;
  }
}
