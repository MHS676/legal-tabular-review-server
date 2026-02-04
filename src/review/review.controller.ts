import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { UpdateReviewDto } from './dto/update-review.dto';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @ApiOperation({ summary: 'Get all reviews' })
  @ApiResponse({ status: 200, description: 'List of all reviews' })
  findAll(@Query('extractionId') extractionId?: string, @Query('status') status?: string) {
    return this.reviewService.findAll(extractionId, status);
  }

  @Get('statistics/:projectId')
  @ApiOperation({ summary: 'Get review statistics for a project' })
  @ApiResponse({ status: 200, description: 'Review statistics by status' })
  getStatistics(@Param('projectId') projectId: string) {
    return this.reviewService.getReviewStatistics(projectId);
  }

  @Get('progress/:projectId')
  @ApiOperation({ summary: 'Get review progress for a project' })
  @ApiResponse({ status: 200, description: 'Review progress metrics' })
  getProgress(@Param('projectId') projectId: string) {
    return this.reviewService.getProjectReviewProgress(projectId);
  }

  @Get('extracted-field/:extractedFieldId')
  @ApiOperation({ summary: 'Get review by extracted field ID' })
  @ApiResponse({ status: 200, description: 'Review details' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  findByExtractedFieldId(@Param('extractedFieldId') extractedFieldId: string) {
    return this.reviewService.findByExtractedFieldId(extractedFieldId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review by ID' })
  @ApiResponse({ status: 200, description: 'Review details' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update review status and data' })
  @ApiResponse({ status: 200, description: 'Review updated successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(id, updateReviewDto);
  }
}
