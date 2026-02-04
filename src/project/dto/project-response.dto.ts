import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '@prisma/client';

export class ProjectResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ enum: ProjectStatus })
  status: ProjectStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false })
  _count?: {
    documents: number;
    fieldTemplates: number;
    extractions: number;
  };
}
