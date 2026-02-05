import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentFormat } from '@prisma/client';

@ApiTags('documents')
@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        projectId: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Document uploaded successfully' })
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body('projectId') projectId: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!projectId) {
      throw new BadRequestException('projectId is required');
    }

    const format = this.getDocumentFormat(file.originalname);
    
    // For now, only parse TXT and HTML files directly
    let parsedText: string | null = null;
    if (format === DocumentFormat.TXT || format === DocumentFormat.HTML) {
      try {
        parsedText = file.buffer.toString('utf-8');
      } catch (error) {
        console.warn('Failed to parse file as UTF-8:', error);
      }
    }
    // For PDF and DOCX, parsedText remains null until proper parser is implemented
    
    const createDocumentDto: CreateDocumentDto = {
      projectId,
      fileName: file.originalname,
      fileSize: file.size,
      format,
      parsedText,
      metadata: {
        mimetype: file.mimetype,
        encoding: file.encoding,
        uploadedBy: 'system',
      },
    };

    return this.documentService.create(createDocumentDto);
  }

  @Post()
  @ApiOperation({ summary: 'Create a document record' })
  @ApiResponse({ status: 201, description: 'Document created successfully' })
  create(@Body() createDocumentDto: CreateDocumentDto) {
    return this.documentService.create(createDocumentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents' })
  @ApiResponse({ status: 200, description: 'List of all documents' })
  findAll(@Query('projectId') projectId?: string) {
    return this.documentService.findAll(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document by ID' })
  @ApiResponse({ status: 200, description: 'Document details' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete document' })
  @ApiResponse({ status: 204, description: 'Document deleted successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  remove(@Param('id') id: string) {
    return this.documentService.remove(id);
  }

  private getDocumentFormat(filename: string): DocumentFormat {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return DocumentFormat.PDF;
      case 'docx':
      case 'doc':
        return DocumentFormat.DOCX;
      case 'html':
      case 'htm':
        return DocumentFormat.HTML;
      case 'txt':
        return DocumentFormat.TXT;
      default:
        return DocumentFormat.TXT;
    }
  }
}
