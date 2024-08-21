import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  Matches,
  IsInt,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { CreateTopingDto } from 'src/toping/dto/create-toping.dto';

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTopingDto)
  topings: CreateTopingDto[];
}
