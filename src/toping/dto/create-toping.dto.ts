import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTopingDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsNotEmpty()
  namaToping: string;

  @IsNumber()
  @IsNotEmpty()
  hargaToping: number;
}
