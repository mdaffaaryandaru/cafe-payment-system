import {
  IsString,
  IsNotEmpty,
  Matches,
  IsInt,
  IsOptional,
} from 'class-validator';

export class CreateMenuDto {
  // make example for dto menu
  @IsString()
  @IsNotEmpty()
  namaPegawai: string;

  @IsString()
  @IsNotEmpty()
  alamatPegawai: string;

  @IsString()
  @IsNotEmpty()
  noHpPegawai: string;

  @IsString()
  @IsNotEmpty()
  statusPegawai: string;
}
