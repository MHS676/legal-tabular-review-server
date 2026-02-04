# Legal Tabular Review - Backend

Professional NestJS backend for the Legal Tabular Review System with PostgreSQL and Prisma ORM.

## Technology Stack

- **Framework**: NestJS 10.x
- **Database**: PostgreSQL (Railway)
- **ORM**: Prisma 5.x
- **Language**: TypeScript
- **API Documentation**: Swagger/OpenAPI
- **Validation**: class-validator & class-transformer

## Features

### Core Modules

1. **Project Management**
   - Create, read, update, delete projects
   - Track project status (DRAFT, ACTIVE, COMPLETED, ARCHIVED)
   - Project statistics and metrics

2. **Document Management**
   - Multi-format support (PDF, DOCX, HTML, TXT)
   - File upload and parsing
   - Document metadata storage

3. **Field Template System**
   - Custom field definitions
   - Multiple field types (TEXT, NUMBER, DATE, CURRENCY, etc.)
   - Validation and normalization rules
   - Display order management

4. **Extraction Engine**
   - Automated field extraction from documents
   - Confidence scoring
   - Source citations with position tracking
   - Extraction status tracking

5. **Review Workflow**
   - Review states (CONFIRMED, REJECTED, MANUAL_UPDATED, MISSING_DATA, PENDING)
   - Manual corrections and annotations
   - Reviewer notes
   - Progress tracking and statistics

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── main.ts                # Application entry point
│   ├── app.module.ts          # Root module
│   ├── health/                # Health check endpoint
│   ├── prisma/                # Prisma service module
│   ├── project/               # Project module
│   │   ├── dto/
│   │   ├── project.controller.ts
│   │   ├── project.service.ts
│   │   └── project.module.ts
│   ├── document/              # Document module
│   ├── field-template/        # Field template module
│   ├── extraction/            # Extraction module
│   └── review/                # Review module
├── package.json
├── tsconfig.json
├── nest-cli.json
└── .env
```

## Installation

```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run prisma:generate
```

## Database Setup

```bash
# Run migrations
npm run prisma:migrate

# Open Prisma Studio (Database GUI)
npm run prisma:studio
```

## Running the Application

```bash
# Development mode with watch
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

## API Documentation

Once the application is running, access the Swagger documentation at:

```
http://localhost:3000/api/docs
```

## API Endpoints

### Projects
- `GET /projects` - List all projects
- `POST /projects` - Create project
- `GET /projects/:id` - Get project details
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project
- `GET /projects/:id/statistics` - Get project statistics

### Documents
- `GET /documents` - List all documents
- `POST /documents` - Create document record
- `POST /documents/upload` - Upload document file
- `GET /documents/:id` - Get document details
- `DELETE /documents/:id` - Delete document

### Field Templates
- `GET /field-templates` - List all field templates
- `POST /field-templates` - Create field template
- `GET /field-templates/:id` - Get field template details
- `PATCH /field-templates/:id` - Update field template
- `DELETE /field-templates/:id` - Delete field template

### Extractions
- `GET /extractions` - List all extractions
- `POST /extractions/start` - Start extraction
- `POST /extractions/:id/complete` - Complete extraction
- `PATCH /extractions/:id/fail` - Mark extraction as failed
- `GET /extractions/:id` - Get extraction details

### Reviews
- `GET /reviews` - List all reviews
- `GET /reviews/:id` - Get review details
- `PATCH /reviews/:id` - Update review
- `GET /reviews/statistics/:projectId` - Get review statistics
- `GET /reviews/progress/:projectId` - Get review progress
- `GET /reviews/extracted-field/:extractedFieldId` - Get review by field

### Health
- `GET /health` - Health check endpoint

## Database Schema

### Key Entities

- **Project**: Top-level container for review projects
- **Document**: Legal documents uploaded to projects
- **FieldTemplate**: Custom field definitions
- **Extraction**: Extraction jobs and results
- **ExtractedField**: Individual extracted field values
- **Citation**: Source references for extracted values
- **Review**: Review status and manual corrections
- **AsyncRequestStatus**: Background job tracking

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@host:port/database"
PORT=3000
NODE_ENV=development
```

## Development

```bash
# Linting
npm run lint

# Format code
npm run format

# Run tests
npm run test

# Run tests with coverage
npm run test:cov
```

## License

MIT
# legal-tabular-review-server
