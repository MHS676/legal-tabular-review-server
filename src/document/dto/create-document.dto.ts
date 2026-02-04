import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { DocumentFormat } from '@prisma/client';

export class CreateDocumentDto {
  @ApiProperty({ description: 'Project ID' })
  @IsString()
  projectId: string;

  @ApiProperty({ description: 'File name' })
  @IsString()
  fileName: string;

  @ApiProperty({ description: 'File size in bytes' })
  @IsNumber()
  fileSize: number;

  @ApiProperty({ enum: DocumentFormat })
  @IsEnum(DocumentFormat)
  format: DocumentFormat;

  @ApiProperty({ required: false, description: 'Parsed text content' })
  @IsOptional()
  @IsString()
  parsedText?: string;

  @ApiProperty({ required: false, description: 'Document metadata' })
  @IsOptional()
  metadata?: any;
}
