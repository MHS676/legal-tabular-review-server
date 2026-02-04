import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectModule } from './project/project.module';
import { DocumentModule } from './document/document.module';
import { FieldTemplateModule } from './field-template/field-template.module';
import { ExtractionModule } from './extraction/extraction.module';
import { ReviewModule } from './review/review.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    ProjectModule,
    DocumentModule,
    FieldTemplateModule,
    ExtractionModule,
    ReviewModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
