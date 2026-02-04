import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFieldTemplateDto } from './dto/create-field-template.dto';
import { UpdateFieldTemplateDto } from './dto/update-field-template.dto';

@Injectable()
export class FieldTemplateService {
  constructor(private prisma: PrismaService) {}

  async create(createFieldTemplateDto: CreateFieldTemplateDto) {
    // Check for duplicate field name in project
    const existing = await this.prisma.fieldTemplate.findUnique({
      where: {
        projectId_fieldName: {
          projectId: createFieldTemplateDto.projectId,
          fieldName: createFieldTemplateDto.fieldName,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        `Field template with name '${createFieldTemplateDto.fieldName}' already exists in this project`,
      );
    }

    return this.prisma.fieldTemplate.create({
      data: createFieldTemplateDto,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll(projectId?: string) {
    return this.prisma.fieldTemplate.findMany({
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
            extractedFields: true,
          },
        },
      },
      orderBy: {
        displayOrder: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const fieldTemplate = await this.prisma.fieldTemplate.findUnique({
      where: { id },
      include: {
        project: true,
        extractedFields: {
          include: {
            extraction: {
              include: {
                document: true,
              },
            },
          },
        },
      },
    });

    if (!fieldTemplate) {
      throw new NotFoundException(`Field template with ID ${id} not found`);
    }

    return fieldTemplate;
  }

  async update(id: string, updateFieldTemplateDto: UpdateFieldTemplateDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.fieldTemplate.update({
      where: { id },
      data: updateFieldTemplateDto,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.fieldTemplate.delete({
      where: { id },
    });
  }
}
