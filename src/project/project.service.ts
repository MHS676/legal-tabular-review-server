import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
      data: createProjectDto,
      include: {
        _count: {
          select: {
            documents: true,
            fieldTemplates: true,
            extractions: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.project.findMany({
      include: {
        _count: {
          select: {
            documents: true,
            fieldTemplates: true,
            extractions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        documents: {
          orderBy: { uploadedAt: 'desc' },
        },
        fieldTemplates: {
          orderBy: { displayOrder: 'asc' },
        },
        _count: {
          select: {
            documents: true,
            fieldTemplates: true,
            extractions: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
      include: {
        _count: {
          select: {
            documents: true,
            fieldTemplates: true,
            extractions: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.project.delete({
      where: { id },
    });
  }

  async getProjectStatistics(id: string) {
    await this.findOne(id); // Check if exists

    const [documentCount, fieldTemplateCount, extractionStats] = await Promise.all([
      this.prisma.document.count({ where: { projectId: id } }),
      this.prisma.fieldTemplate.count({ where: { projectId: id } }),
      this.prisma.extraction.groupBy({
        by: ['status'],
        where: { projectId: id },
        _count: true,
      }),
    ]);

    return {
      documentCount,
      fieldTemplateCount,
      extractionStats,
    };
  }
}
