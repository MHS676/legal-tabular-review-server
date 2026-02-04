import { PartialType } from '@nestjs/swagger';
import { CreateFieldTemplateDto } from './create-field-template.dto';

export class UpdateFieldTemplateDto extends PartialType(CreateFieldTemplateDto) {}
