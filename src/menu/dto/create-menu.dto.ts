import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  Matches,
  IsInt,
  IsOptional,
  IsDate,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { CreateTopingDto } from 'src/toping/dto/create-toping.dto';

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

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateTopingDto)
  @ApiProperty({ type: [CreateTopingDto], default: [] })
  topings: CreateTopingDto[];
}
