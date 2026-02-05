import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive seed...');

  // 1. Create Projects
  const project1 = await prisma.project.create({
    data: {
      id: 'proj-tesla-2025',
      name: 'Tesla 2025 Proxy Statement Review',
      description: 'Review of Tesla PRE 14A proxy statement filed 09/05/2025',
      status: 'ACTIVE',
    },
  });

  const project2 = await prisma.project.create({
    data: {
      id: 'proj-contracts-q1',
      name: 'Q1 2026 Contract Review',
      description: 'Standard contract review for Q1 2026',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Created projects:', project1.name, project2.name);

  // 2. Create Field Templates for Tesla Project
  const templates = await Promise.all([
    prisma.fieldTemplate.create({
      data: {
        projectId: project1.id,
        fieldName: 'Filing Date',
        fieldType: 'DATE',
        description: 'Date the document was filed with SEC',
        isRequired: true,
        displayOrder: 1,
      },
    }),
    prisma.fieldTemplate.create({
      data: {
        projectId: project1.id,
        fieldName: 'Company Name',
        fieldType: 'TEXT',
        description: 'Name of the filing company',
        isRequired: true,
        displayOrder: 2,
      },
    }),
    prisma.fieldTemplate.create({
      data: {
        projectId: project1.id,
        fieldName: 'Document Type',
        fieldType: 'TEXT',
        description: 'Type of SEC filing',
        isRequired: true,
        displayOrder: 3,
      },
    }),
    prisma.fieldTemplate.create({
      data: {
        projectId: project1.id,
        fieldName: 'Total Pages',
        fieldType: 'NUMBER',
        description: 'Total number of pages in document',
        isRequired: false,
        displayOrder: 4,
      },
    }),
    prisma.fieldTemplate.create({
      data: {
        projectId: project1.id,
        fieldName: 'Meeting Date',
        fieldType: 'DATE',
        description: 'Date of shareholder meeting',
        isRequired: false,
        displayOrder: 5,
      },
    }),
  ]);

  console.log('✅ Created', templates.length, 'field templates');

  // 3. Create Field Templates for Contract Project
  const contractTemplates = await Promise.all([
    prisma.fieldTemplate.create({
      data: {
        projectId: project2.id,
        fieldName: 'Contract Date',
        fieldType: 'DATE',
        description: 'Effective date of the contract',
        isRequired: true,
        displayOrder: 1,
      },
    }),
    prisma.fieldTemplate.create({
      data: {
        projectId: project2.id,
        fieldName: 'Party Name',
        fieldType: 'TEXT',
        description: 'Name of the contracting party',
        isRequired: true,
        displayOrder: 2,
      },
    }),
    prisma.fieldTemplate.create({
      data: {
        projectId: project2.id,
        fieldName: 'Contract Value',
        fieldType: 'CURRENCY',
        description: 'Total value of the contract',
        isRequired: true,
        displayOrder: 3,
      },
    }),
    prisma.fieldTemplate.create({
      data: {
        projectId: project2.id,
        fieldName: 'Payment Terms',
        fieldType: 'TEXT',
        description: 'Payment schedule and terms',
        isRequired: false,
        displayOrder: 4,
      },
    }),
  ]);

  console.log('✅ Created', contractTemplates.length, 'contract field templates');

  // 4. Create Documents
  const doc1 = await prisma.document.create({
    data: {
      projectId: project1.id,
      fileName: 'Tesla PRE 14A Proxy Statement (09-05-2025).html',
      fileSize: 2458976,
      format: 'HTML',
      parsedText: 'Tesla, Inc. Proxy Statement. Filed: September 5, 2025. Annual Meeting Date: October 15, 2025...',
      metadata: {
        source: 'SEC Edgar',
        filingType: 'PRE 14A',
        cik: '1318605',
      },
    },
  });

  const doc2 = await prisma.document.create({
    data: {
      projectId: project1.id,
      fileName: 'EX-10.2 Employment Agreement.html',
      fileSize: 156789,
      format: 'HTML',
      parsedText: 'Employment Agreement... Effective Date: January 1, 2026...',
      metadata: {
        source: 'SEC Edgar',
        exhibit: 'EX-10.2',
      },
    },
  });

  const doc3 = await prisma.document.create({
    data: {
      projectId: project2.id,
      fileName: 'vendor_contract_2026.pdf',
      fileSize: 1024567,
      format: 'PDF',
      parsedText: 'Service Agreement between ABC Corp and XYZ Vendor...',
    },
  });

  console.log('✅ Created', 3, 'documents');

  // 5. Create Extractions
  const extraction1 = await prisma.extraction.create({
    data: {
      projectId: project1.id,
      documentId: doc1.id,
      status: 'COMPLETED',
      startedAt: new Date('2026-02-05T05:00:00Z'),
      completedAt: new Date('2026-02-05T05:02:30Z'),
    },
  });

  const extraction2 = await prisma.extraction.create({
    data: {
      projectId: project1.id,
      documentId: doc2.id,
      status: 'COMPLETED',
      startedAt: new Date('2026-02-05T05:03:00Z'),
      completedAt: new Date('2026-02-05T05:04:15Z'),
    },
  });

  const extraction3 = await prisma.extraction.create({
    data: {
      projectId: project2.id,
      documentId: doc3.id,
      status: 'PROCESSING',
      startedAt: new Date('2026-02-05T06:00:00Z'),
    },
  });

  console.log('✅ Created', 3, 'extractions');

  // 6. Create Extracted Fields with Citations for Tesla Proxy
  const extractedFields1 = await Promise.all([
    prisma.extractedField.create({
      data: {
        extractionId: extraction1.id,
        fieldTemplateId: templates[0].id, // Filing Date
        rawValue: 'September 5, 2025',
        normalizedValue: '2025-09-05',
        confidence: 0.98,
      },
    }),
    prisma.extractedField.create({
      data: {
        extractionId: extraction1.id,
        fieldTemplateId: templates[1].id, // Company Name
        rawValue: 'Tesla, Inc.',
        normalizedValue: 'Tesla, Inc.',
        confidence: 0.99,
      },
    }),
    prisma.extractedField.create({
      data: {
        extractionId: extraction1.id,
        fieldTemplateId: templates[2].id, // Document Type
        rawValue: 'PRE 14A',
        normalizedValue: 'Preliminary Proxy Statement',
        confidence: 0.97,
      },
    }),
    prisma.extractedField.create({
      data: {
        extractionId: extraction1.id,
        fieldTemplateId: templates[4].id, // Meeting Date
        rawValue: 'October 15, 2025',
        normalizedValue: '2025-10-15',
        confidence: 0.95,
      },
    }),
  ]);

  console.log('✅ Created', extractedFields1.length, 'extracted fields for doc 1');

  // 7. Create Citations
  await Promise.all([
    prisma.citation.create({
      data: {
        extractedFieldId: extractedFields1[0].id,
        documentId: doc1.id,
        pageNumber: 1,
        textSnippet: 'Filed: September 5, 2025',
        startPosition: 125,
        endPosition: 150,
      },
    }),
    prisma.citation.create({
      data: {
        extractedFieldId: extractedFields1[1].id,
        documentId: doc1.id,
        pageNumber: 1,
        textSnippet: 'Tesla, Inc. (the "Company")',
        startPosition: 45,
        endPosition: 75,
      },
    }),
    prisma.citation.create({
      data: {
        extractedFieldId: extractedFields1[2].id,
        documentId: doc1.id,
        pageNumber: 1,
        textSnippet: 'FORM PRE 14A - Preliminary Proxy Statement',
        startPosition: 200,
        endPosition: 245,
      },
    }),
    prisma.citation.create({
      data: {
        extractedFieldId: extractedFields1[3].id,
        documentId: doc1.id,
        pageNumber: 2,
        textSnippet: 'Annual Meeting to be held October 15, 2025',
        startPosition: 1250,
        endPosition: 1295,
      },
    }),
  ]);

  console.log('✅ Created citations');

  // 8. Create Extracted Fields for EX-10.2 document
  const extractedFields2 = await Promise.all([
    prisma.extractedField.create({
      data: {
        extractionId: extraction2.id,
        fieldTemplateId: templates[0].id, // Filing Date
        rawValue: 'January 1, 2026',
        normalizedValue: '2026-01-01',
        confidence: 0.96,
      },
    }),
    prisma.extractedField.create({
      data: {
        extractionId: extraction2.id,
        fieldTemplateId: templates[1].id, // Company Name
        rawValue: 'Tesla, Inc.',
        normalizedValue: 'Tesla, Inc.',
        confidence: 0.99,
      },
    }),
    prisma.extractedField.create({
      data: {
        extractionId: extraction2.id,
        fieldTemplateId: templates[2].id, // Document Type
        rawValue: 'EX-10.2',
        normalizedValue: 'Employment Agreement Exhibit',
        confidence: 0.94,
      },
    }),
  ]);

  console.log('✅ Created', extractedFields2.length, 'extracted fields for doc 2');

  // 9. Create Reviews
  await Promise.all([
    prisma.review.create({
      data: {
        extractedFieldId: extractedFields1[0].id,
        status: 'CONFIRMED',
        reviewedBy: 'John Legal',
        reviewerNotes: 'Date verified against SEC filing header',
        reviewedAt: new Date('2026-02-05T10:15:00Z'),
      },
    }),
    prisma.review.create({
      data: {
        extractedFieldId: extractedFields1[1].id,
        status: 'CONFIRMED',
        reviewedBy: 'John Legal',
        reviewerNotes: 'Company name is correct',
        reviewedAt: new Date('2026-02-05T10:16:00Z'),
      },
    }),
    prisma.review.create({
      data: {
        extractedFieldId: extractedFields1[2].id,
        status: 'MANUAL_UPDATED',
        manualValue: 'Preliminary Proxy Statement (PRE 14A)',
        reviewedBy: 'John Legal',
        reviewerNotes: 'Added clarification for document type',
        reviewedAt: new Date('2026-02-05T10:17:00Z'),
      },
    }),
    prisma.review.create({
      data: {
        extractedFieldId: extractedFields1[3].id,
        status: 'PENDING',
        reviewedBy: null,
        reviewerNotes: null,
      },
    }),
    prisma.review.create({
      data: {
        extractedFieldId: extractedFields2[0].id,
        status: 'PENDING',
        reviewedBy: null,
        reviewerNotes: null,
      },
    }),
  ]);

  console.log('✅ Created reviews');

  // 10. Summary
  const counts = await prisma.$transaction([
    prisma.project.count(),
    prisma.document.count(),
    prisma.fieldTemplate.count(),
    prisma.extraction.count(),
    prisma.extractedField.count(),
    prisma.citation.count(),
    prisma.review.count(),
  ]);

  console.log('\n📊 Database Summary:');
  console.log('  Projects:', counts[0]);
  console.log('  Documents:', counts[1]);
  console.log('  Field Templates:', counts[2]);
  console.log('  Extractions:', counts[3]);
  console.log('  Extracted Fields:', counts[4]);
  console.log('  Citations:', counts[5]);
  console.log('  Reviews:', counts[6]);
  console.log('\n✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
