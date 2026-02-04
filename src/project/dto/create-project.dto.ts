import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ProjectStatus } from '@prisma/client';

export class CreateProjectDto {
  @ApiProperty({ description: 'Project name', example: 'Q4 2023 Contract Review' })
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'Project description', 
    example: 'Review of all vendor contracts from Q4 2023',
    required: false 
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    enum: ProjectStatus, 
    default: ProjectStatus.DRAFT,
    required: false 
  })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}
