import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTopingDto {
  @IsString()
  @IsNotEmpty()
  namaToping: string;

  @IsNumber()
  @IsNotEmpty()
  hargaToping: string;
}
