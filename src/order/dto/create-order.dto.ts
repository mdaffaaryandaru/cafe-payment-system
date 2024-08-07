import { IsNumber, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDetailOrderanDto } from './create-detail-orderan.dto';

export class CreateOrderDto {
  @IsNumber()
  noMeja: number;

  @IsString()
  namaPelanggan: string;

  @IsString()
  statusPesanan: string;

  @IsString()
  jenisPembayaran: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetailOrderanDto)
  orderan: CreateDetailOrderanDto[];

  @IsNumber()
  totalHarga: number;
}
