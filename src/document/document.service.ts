import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';

@Injectable()
export class DocumentService {
  constructor(private prisma: PrismaService) {}

  async create(createDocumentDto: CreateDocumentDto) {
    return this.prisma.document.create({
      data: {
        ...createDocumentDto,
        parsedAt: createDocumentDto.parsedText ? new Date() : null,
      },
      include: {
        project: true,
      },
    });
  }

  async findAll(projectId?: string) {
    return this.prisma.document.findMany({
      where: projectId ? { projectId } : undefined,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            extractions: true,
            citations: true,
          },
        },
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: {
        project: true,
        extractions: {
          include: {
            extractedFields: {
              include: {
                fieldTemplate: true,
                citations: true,
                review: true,
              },
            },
          },
        },
      },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return document;
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.document.delete({
      where: { id },
    });
  }

  async updateParsedText(id: string, parsedText: string, metadata?: any) {
    await this.findOne(id); // Check if exists

    return this.prisma.document.update({
      where: { id },
      data: {
        parsedText,
        parsedAt: new Date(),
        metadata,
      },
    });
  }
}
