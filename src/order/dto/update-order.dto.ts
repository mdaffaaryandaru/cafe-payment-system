import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsNumber()
  noMeja?: number;

  @IsOptional()
  @IsString()
  namaPelanggan?: string;

  @IsOptional()
  @IsString()
  statusPesanan?: string;

  @IsOptional()
  @IsString()
  jenisPembayaran?: string;

  @IsOptional()
  @IsNumber()
  totalHarga?: number;

  @IsOptional()
  @IsString()
  gambarTransaksi?: string;

  @IsString()
  @IsOptional()
  pegawai: string;
}
