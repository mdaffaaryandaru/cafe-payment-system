import { PartialType } from '@nestjs/swagger';
import { CreateTopingDto } from './create-toping.dto';

export class UpdateTopingDto extends PartialType(CreateTopingDto) {}
