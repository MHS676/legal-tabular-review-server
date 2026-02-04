import { Module } from '@nestjs/common';
import { FieldTemplateService } from './field-template.service';
import { FieldTemplateController } from './field-template.controller';

@Module({
  controllers: [FieldTemplateController],
  providers: [FieldTemplateService],
  exports: [FieldTemplateService],
})
export class FieldTemplateModule {}
