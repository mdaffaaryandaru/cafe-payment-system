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
  namaMenu: string;

  @IsInt()
  @IsNotEmpty()
  stokMenu: number;

  @IsString()
  @IsNotEmpty()
  kategoriMenu: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^Rp\.\d{1,3}(,\d{3})*$/, {
    message: 'hargaMenu harus dalam format Rp.1.000.000',
  })
  hargaMenu: string;

  @IsOptional()
  @IsString()
  gambarMenu?: string;
}
