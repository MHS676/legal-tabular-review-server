import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { FieldType } from '@prisma/client';

export class CreateFieldTemplateDto {
  @ApiProperty({ description: 'Project ID' })
  @IsString()
  projectId: string;

  @ApiProperty({ description: 'Field name', example: 'Contract Value' })
  @IsString()
  fieldName: string;

  @ApiProperty({ enum: FieldType, example: FieldType.CURRENCY })
  @IsEnum(FieldType)
  fieldType: FieldType;

  @ApiProperty({ required: false, description: 'Field description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @ApiProperty({ required: false, description: 'Validation rules as JSON' })
  @IsOptional()
  validationRules?: any;

  @ApiProperty({ required: false, description: 'Normalization rules as JSON' })
  @IsOptional()
  normalizationRules?: any;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}
