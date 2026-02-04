import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async findAll(extractionId?: string, status?: string) {
    return this.prisma.review.findMany({
      where: {
        ...(extractionId && {
          extractedField: {
            extractionId,
          },
        }),
        ...(status && { status: status as any }),
      },
      include: {
        extractedField: {
          include: {
            fieldTemplate: true,
            extraction: {
              include: {
                document: true,
              },
            },
            citations: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        extractedField: {
          include: {
            fieldTemplate: true,
            extraction: {
              include: {
                document: true,
                project: true,
              },
            },
            citations: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  async findByExtractedFieldId(extractedFieldId: string) {
    const review = await this.prisma.review.findUnique({
      where: { extractedFieldId },
      include: {
        extractedField: {
          include: {
            fieldTemplate: true,
            extraction: true,
            citations: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException(`Review for extracted field ${extractedFieldId} not found`);
    }

    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.review.update({
      where: { id },
      data: {
        ...updateReviewDto,
        reviewedAt: new Date(),
      },
      include: {
        extractedField: {
          include: {
            fieldTemplate: true,
            extraction: {
              include: {
                document: true,
              },
            },
            citations: true,
          },
        },
      },
    });
  }

  async getReviewStatistics(projectId: string) {
    const stats = await this.prisma.review.groupBy({
      by: ['status'],
      where: {
        extractedField: {
          extraction: {
            projectId,
          },
        },
      },
      _count: true,
    });

    return stats;
  }

  async getProjectReviewProgress(projectId: string) {
    const total = await this.prisma.review.count({
      where: {
        extractedField: {
          extraction: {
            projectId,
          },
        },
      },
    });

    const reviewed = await this.prisma.review.count({
      where: {
        extractedField: {
          extraction: {
            projectId,
          },
        },
        status: {
          in: ['CONFIRMED', 'REJECTED', 'MANUAL_UPDATED'],
        },
      },
    });

    return {
      total,
      reviewed,
      pending: total - reviewed,
      progressPercentage: total > 0 ? (reviewed / total) * 100 : 0,
    };
  }
}
