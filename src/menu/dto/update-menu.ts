import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Matches,
  IsInt,
  IsOptional,
} from 'class-validator';

export class UpdateMenuDto {
  // make example for dto menu
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  namaMenu: string;

  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  stokMenu: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  kategoriMenu: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
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
