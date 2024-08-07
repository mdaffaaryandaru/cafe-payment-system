import { IsNumber } from 'class-validator';

export class CreateDetailOrderanDto {
  @IsNumber()
  menuId: number;

  @IsNumber()
  orderId: number;

  @IsNumber()
  jumlah: number;

  @IsNumber()
  harga: number;
}
