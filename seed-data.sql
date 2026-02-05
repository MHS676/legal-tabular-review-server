-- Seed data for testing
-- Run this in your database or use Prisma Studio

-- Create a sample project
INSERT INTO "Project" (id, name, description, status, "createdAt", "updatedAt")
VALUES (
  'proj_001',
  'Sample Contract Review',
  'Q1 2026 Vendor Contracts Review Project',
  'ACTIVE',
  NOW(),
  NOW()
);

-- Create field templates
INSERT INTO "FieldTemplate" (id, "projectId", "fieldName", "fieldType", description, "isRequired", "displayOrder", "createdAt", "updatedAt")
VALUES
  ('tmpl_001', 'proj_001', 'Contract Date', 'DATE', 'Effective date of the contract', true, 1, NOW(), NOW()),
  ('tmpl_002', 'proj_001', 'Party Name', 'TEXT', 'Name of the contracting party', true, 2, NOW(), NOW()),
  ('tmpl_003', 'proj_001', 'Contract Value', 'CURRENCY', 'Total value of the contract', true, 3, NOW(), NOW()),
  ('tmpl_004', 'proj_001', 'Payment Terms', 'TEXT', 'Payment schedule and terms', false, 4, NOW(), NOW());

-- Create a sample document
INSERT INTO "Document" (id, "projectId", "fileName", "fileSize", format, "uploadedAt")
VALUES (
  'doc_001',
  'proj_001',
  'vendor_contract_2026.pdf',
  1024567,
  'PDF',
  NOW()
);
