import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExtractionService } from './extraction.service';
import { CreateExtractionDto, CompleteExtractionDto } from './dto/create-extraction.dto';

@ApiTags('extractions')
@Controller('extractions')
export class ExtractionController {
  constructor(private readonly extractionService: ExtractionService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start a new extraction process' })
  @ApiResponse({ status: 201, description: 'Extraction started successfully' })
  startExtraction(@Body() createExtractionDto: CreateExtractionDto) {
    return this.extractionService.startExtraction(createExtractionDto);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete an extraction with field data' })
  @ApiResponse({ status: 200, description: 'Extraction completed successfully' })
  completeExtraction(
    @Param('id') id: string,
    @Body() completeExtractionDto: CompleteExtractionDto,
  ) {
    return this.extractionService.completeExtraction(id, completeExtractionDto);
  }

  @Patch(':id/fail')
  @ApiOperation({ summary: 'Mark extraction as failed' })
  @ApiResponse({ status: 200, description: 'Extraction marked as failed' })
  markAsFailed(@Param('id') id: string, @Body('errorMessage') errorMessage: string) {
    return this.extractionService.markAsFailed(id, errorMessage);
  }

  @Get()
  @ApiOperation({ summary: 'Get all extractions' })
  @ApiResponse({ status: 200, description: 'List of all extractions' })
  findAll(@Query('projectId') projectId?: string, @Query('documentId') documentId?: string) {
    return this.extractionService.findAll(projectId, documentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get extraction by ID' })
  @ApiResponse({ status: 200, description: 'Extraction details with all extracted fields' })
  @ApiResponse({ status: 404, description: 'Extraction not found' })
  findOne(@Param('id') id: string) {
    return this.extractionService.findOne(id);
  }
}
