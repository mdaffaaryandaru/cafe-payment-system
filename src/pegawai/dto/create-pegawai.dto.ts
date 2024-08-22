import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Matches,
  IsInt,
  IsOptional,
} from 'class-validator';

export class CreatePegawaiDto {
  // make example for dto menu
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  namaPegawai: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  alamatPegawai: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  noHpPegawai: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  statusPegawai: string;
}