import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReviewStatus } from '@prisma/client';

export class UpdateReviewDto {
  @ApiProperty({ enum: ReviewStatus })
  @IsEnum(ReviewStatus)
  status: ReviewStatus;

  @ApiProperty({ required: false, description: 'Manually entered or corrected value' })
  @IsOptional()
  @IsString()
  manualValue?: string;

  @ApiProperty({ required: false, description: 'Reviewer notes or comments' })
  @IsOptional()
  @IsString()
  reviewerNotes?: string;

  @ApiProperty({ required: false, description: 'Reviewer identifier' })
  @IsOptional()
  @IsString()
  reviewedBy?: string;
}
