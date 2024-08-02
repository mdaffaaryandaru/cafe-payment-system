import { IsString, IsNotEmpty, Matches, IsInt } from 'class-validator';

export class UpdateMenuDto {
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

  gambarMenu?: string;
}
