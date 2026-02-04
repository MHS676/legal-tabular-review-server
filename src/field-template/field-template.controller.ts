import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FieldTemplateService } from './field-template.service';
import { CreateFieldTemplateDto } from './dto/create-field-template.dto';
import { UpdateFieldTemplateDto } from './dto/update-field-template.dto';

@ApiTags('field-templates')
@Controller('field-templates')
export class FieldTemplateController {
  constructor(private readonly fieldTemplateService: FieldTemplateService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new field template' })
  @ApiResponse({ status: 201, description: 'Field template created successfully' })
  @ApiResponse({ status: 409, description: 'Field template with this name already exists' })
  create(@Body() createFieldTemplateDto: CreateFieldTemplateDto) {
    return this.fieldTemplateService.create(createFieldTemplateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all field templates' })
  @ApiResponse({ status: 200, description: 'List of all field templates' })
  findAll(@Query('projectId') projectId?: string) {
    return this.fieldTemplateService.findAll(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get field template by ID' })
  @ApiResponse({ status: 200, description: 'Field template details' })
  @ApiResponse({ status: 404, description: 'Field template not found' })
  findOne(@Param('id') id: string) {
    return this.fieldTemplateService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update field template' })
  @ApiResponse({ status: 200, description: 'Field template updated successfully' })
  @ApiResponse({ status: 404, description: 'Field template not found' })
  update(@Param('id') id: string, @Body() updateFieldTemplateDto: UpdateFieldTemplateDto) {
    return this.fieldTemplateService.update(id, updateFieldTemplateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete field template' })
  @ApiResponse({ status: 204, description: 'Field template deleted successfully' })
  @ApiResponse({ status: 404, description: 'Field template not found' })
  remove(@Param('id') id: string) {
    return this.fieldTemplateService.remove(id);
  }
}
