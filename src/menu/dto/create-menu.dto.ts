import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Matches,
  IsInt,
  IsOptional,
  IsDate,
} from 'class-validator';

export class CreateMenuDto {
  // make example for dto menu
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  namaMenu: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  stokMenu: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  kategoriMenu: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Matches(/^Rp\.\d{1,3}(,\d{3})*$/, {
    message: 'hargaMenu harus dalam format Rp.1.000.000',
  })
  hargaMenu: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  gambarMenu?: string;
}
