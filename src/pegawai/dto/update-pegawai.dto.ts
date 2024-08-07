import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Matches,
  IsInt,
  IsOptional,
} from 'class-validator';

export class UpdatePegawaiDto {
  // make example for dto menu
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  namaPegawai: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  alamatPegawai: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  noHpPegawai: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  statusPegawai: string;
}
