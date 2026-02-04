import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExtractionDto, CompleteExtractionDto } from './dto/create-extraction.dto';
import { ExtractionStatus } from '@prisma/client';

@Injectable()
export class ExtractionService {
  constructor(private prisma: PrismaService) {}

  async startExtraction(createExtractionDto: CreateExtractionDto) {
    // Verify project and document exist
    const document = await this.prisma.document.findUnique({
      where: { id: createExtractionDto.documentId },
      include: { project: true },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (document.projectId !== createExtractionDto.projectId) {
      throw new BadRequestException('Document does not belong to this project');
    }

    return this.prisma.extraction.create({
      data: {
        projectId: createExtractionDto.projectId,
        documentId: createExtractionDto.documentId,
        status: ExtractionStatus.PROCESSING,
        startedAt: new Date(),
      },
      include: {
        project: true,
        document: true,
      },
    });
  }

  async completeExtraction(extractionId: string, completeExtractionDto: CompleteExtractionDto) {
    const extraction = await this.prisma.extraction.findUnique({
      where: { id: extractionId },
    });

    if (!extraction) {
      throw new NotFoundException('Extraction not found');
    }

    // Create extracted fields with citations
    await this.prisma.$transaction(async (tx) => {
      for (const fieldData of completeExtractionDto.extractedFields) {
        const extractedField = await tx.extractedField.create({
          data: {
            extractionId,
            fieldTemplateId: fieldData.fieldTemplateId,
            rawValue: fieldData.rawValue,
            normalizedValue: fieldData.normalizedValue,
            confidence: fieldData.confidence,
          },
        });

        // Create citations if provided
        if (fieldData.citations && fieldData.citations.length > 0) {
          await tx.citation.createMany({
            data: fieldData.citations.map((citation) => ({
              extractedFieldId: extractedField.id,
              documentId: extraction.documentId,
              ...citation,
            })),
          });
        }

        // Create initial review record
        await tx.review.create({
          data: {
            extractedFieldId: extractedField.id,
            status: 'PENDING',
          },
        });
      }

      // Update extraction status
      await tx.extraction.update({
        where: { id: extractionId },
        data: {
          status: ExtractionStatus.COMPLETED,
          completedAt: new Date(),
        },
      });
    });

    return this.findOne(extractionId);
  }

  async findAll(projectId?: string, documentId?: string) {
    return this.prisma.extraction.findMany({
      where: {
        ...(projectId && { projectId }),
        ...(documentId && { documentId }),
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        document: {
          select: {
            id: true,
            fileName: true,
          },
        },
        _count: {
          select: {
            extractedFields: true,
          },
        },
      },
      orderBy: {
        startedAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const extraction = await this.prisma.extraction.findUnique({
      where: { id },
      include: {
        project: true,
        document: true,
        extractedFields: {
          include: {
            fieldTemplate: true,
            citations: true,
            review: true,
          },
        },
      },
    });

    if (!extraction) {
      throw new NotFoundException(`Extraction with ID ${id} not found`);
    }

    return extraction;
  }

  async markAsFailed(id: string, errorMessage: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.extraction.update({
      where: { id },
      data: {
        status: ExtractionStatus.FAILED,
        completedAt: new Date(),
        errorMessage,
      },
    });
  }
}
