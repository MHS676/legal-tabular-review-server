import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateExtractionDto {
  @ApiProperty({ description: 'Project ID' })
  @IsString()
  projectId: string;

  @ApiProperty({ description: 'Document ID' })
  @IsString()
  documentId: string;
}

export class ExtractedFieldDataDto {
  @ApiProperty({ description: 'Field template ID' })
  @IsString()
  fieldTemplateId: string;

  @ApiProperty({ required: false, description: 'Raw extracted value' })
  @IsOptional()
  @IsString()
  rawValue?: string;

  @ApiProperty({ required: false, description: 'Normalized value' })
  @IsOptional()
  @IsString()
  normalizedValue?: string;

  @ApiProperty({ description: 'Confidence score (0-1)', minimum: 0, maximum: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  confidence: number;

  @ApiProperty({ required: false, description: 'Citations' })
  @IsOptional()
  @IsArray()
  citations?: {
    startPosition?: number;
    endPosition?: number;
    pageNumber?: number;
    textSnippet?: string;
  }[];
}

export class CompleteExtractionDto {
  @ApiProperty({ type: [ExtractedFieldDataDto] })
  @IsArray()
  extractedFields: ExtractedFieldDataDto[];
}
