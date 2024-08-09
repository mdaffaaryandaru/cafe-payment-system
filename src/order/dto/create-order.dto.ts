import { IsNumber, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDetailOrderanDto } from './create-detail-orderan.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @IsNumber()
  @ApiProperty()
  noMeja: number;

  @IsString()
  @ApiProperty()
  namaPelanggan: string;

  @IsString()
  @ApiProperty()
  statusPesanan: string;

  @IsString()
  @ApiProperty()
  jenisPembayaran: string;

  @IsArray()
  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => CreateDetailOrderanDto)
  orderan: CreateDetailOrderanDto[];

  @IsNumber()
  @ApiProperty()
  totalHarga: number;

  @IsString()
  @ApiProperty()
  gambarTransaksi?: string;
}
