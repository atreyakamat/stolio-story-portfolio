---

# Stolio — Technical Architecture Document

---

# 1. Technical Purpose

The purpose of this document is to define the system architecture, technology stack, and data flow required to build Stolio.

Stolio is an AI-powered portfolio generation platform that converts a user's resume or professional information into a story-driven animated portfolio website. The system must support user authentication, portfolio generation, AI-driven content processing, style rendering, and portfolio hosting.

The architecture is designed to prioritize scalability, modularity, and performance while maintaining a clear separation between the frontend interface, backend APIs, AI processing layer, and portfolio rendering engine.

---

# 2. System Overview

The Stolio system consists of four major layers.

**Frontend Application**
The web interface where users create and manage portfolios.

**Backend API**
Handles authentication, portfolio storage, and portfolio generation requests.

**AI Processing Layer**
Processes resumes and generates structured portfolio content.

**Portfolio Rendering Engine**
Converts structured data into interactive portfolio websites.

---

### High-Level System Flow

```
User
 ↓
Frontend (Next.js)
 ↓
API Server (Node.js)
 ↓
AI Engine (Ollama Cloud)
 ↓
Portfolio Generator
 ↓
Database (PostgreSQL)
 ↓
Rendered Portfolio Website
```

This layered architecture allows each system component to evolve independently.

---

# 3. Technology Stack

The chosen technology stack prioritizes developer productivity, performance, and scalability.

## Frontend

Framework: **Next.js**

Next.js is used because it supports both static site generation and dynamic rendering, allowing portfolios to be deployed efficiently while still supporting dynamic features if required.

Primary frontend technologies:

• Next.js (App Router)
• React
• TypeScript
• Tailwind CSS
• Framer Motion (animations)

---

## Backend

Backend services are built using Node.js to support REST APIs and server-side logic.

Technologies:

• Node.js
• Express.js
• TypeScript
• Prisma ORM

The backend manages user accounts, portfolio data, generation requests, and integration with the AI layer.

---

## Database

Stolio uses **PostgreSQL** as the primary relational database.

Reasons:

• structured data model
• strong relational support
• reliability and scalability

Prisma ORM will manage database interactions.

---

## AI Infrastructure

AI processing is handled through **Ollama Cloud**.

Responsibilities of the AI layer:

• resume text parsing
• structured data extraction
• portfolio narrative generation
• tagline generation
• prompt-based portfolio edits

Using Ollama Cloud allows the system to run open-source models while maintaining control over performance and cost.

---

# 4. Monorepo Project Structure

The Stolio codebase will follow a monorepo architecture.

```
stolio/
 ├ apps/
 │   ├ web/          (Next.js frontend)
 │   └ api/          (Node.js backend)
 │
 ├ packages/
 │   ├ ui/           (shared UI components)
 │   └ types/        (shared TypeScript types)
 │
 ├ services/
 │   ├ ai-engine/
 │   └ portfolio-generator/
 │
 ├ configs/
 └ docs/
```

This structure ensures shared logic and components can be reused across the system.

---

# 5. Frontend Architecture

The frontend application is responsible for the user interface and portfolio rendering.

### Frontend Responsibilities

User authentication interface
Portfolio creation flow
Portfolio preview interface
Portfolio editing interface
Landing page and marketing pages
Rendering of portfolio websites

---

### Frontend Directory Structure

```
apps/web/src
 ├ app/
 ├ components/
 ├ sections/
 ├ themes/
 ├ animations/
 ├ utils/
 └ types/
```

---

### Sections Folder

Each portfolio section is implemented as a reusable component.

Examples:

HeroSection
AboutSection
SkillsSection
ProjectsSection
TimelineSection
ContactSection

These components receive structured portfolio data and render it according to the selected style.

---

### Themes Folder

Themes define visual styling for portfolios.

Example theme directories:

```
themes/
 ├ minimal
 ├ glassmorphism
 ├ neobrutalism
 ├ y2k
 └ clay
```

Each theme exports styling configurations and component variations.

---

# 6. Backend Architecture

The backend API server handles application logic.

### Core Responsibilities

User authentication
Portfolio storage
Portfolio generation requests
Resume processing
Communication with AI layer

---

### Backend Directory Structure

```
apps/api/src
 ├ routes/
 ├ controllers/
 ├ services/
 ├ models/
 ├ middleware/
 └ utils/
```

---

### Backend Modules

**Auth Service**

Handles user login and account creation.

**Portfolio Service**

Manages portfolio creation, updates, and retrieval.

**Generation Service**

Triggers AI generation workflows.

**Resume Service**

Handles resume file upload and text extraction.

---

# 7. AI Processing Pipeline

The AI pipeline is responsible for converting raw user input into structured portfolio content.

### Step 1 — Resume Parsing

The system extracts text from uploaded resumes.

Supported formats:

PDF
DOCX

Libraries used may include:

• pdf-parse
• mammoth.js

---

### Step 2 — Structured Data Extraction

AI converts the extracted text into structured portfolio data.

Example output:

```
{
 name
 title
 tagline
 bio
 skills[]
 projects[]
 experience[]
 links[]
}
```

---

### Step 3 — Narrative Generation

The AI rewrites and organizes content into readable sections.

Generated elements include:

• professional tagline
• bio summary
• project descriptions
• experience highlights

---

### Step 4 — Portfolio Data Assembly

The system compiles structured data into a complete portfolio object used by the rendering engine.

---

# 8. Portfolio Rendering System

The portfolio rendering system converts structured data into visual websites.

### Rendering Workflow

```
Portfolio JSON
 ↓
Theme Selection
 ↓
Component Assembly
 ↓
Rendered Portfolio Page
```

The rendering engine maps portfolio data to visual components defined in the theme system.

---

# 9. Database Schema Overview

The core database entities include:

---

### User Table

Fields:

User ID
Email
Password Hash
Account Type
Created At

---

### Portfolio Table

Fields:

Portfolio ID
User ID
Portfolio Name
Username Slug
Theme Style
Theme Mode
Created At

---

### Portfolio Content Table

Fields:

Portfolio ID
Tagline
Bio
Skills JSON
Projects JSON
Experience JSON
Links JSON

---

This structure separates user identity from portfolio data for flexibility.

---

# 10. API Endpoints

Key backend endpoints include:

---

### Authentication

POST /auth/register
POST /auth/login

---

### Portfolio Generation

POST /portfolio/generate

Input:

Resume text or file

Output:

Generated portfolio data

---

### Portfolio Retrieval

GET /portfolio/:username

Returns portfolio data used for rendering.

---

### Portfolio Editing

POST /portfolio/edit

Allows AI prompt-based editing.

---

### Portfolio Deletion

DELETE /portfolio/:id

Users can regenerate portfolios up to three times.

---

# 11. Static vs Dynamic Portfolio Rendering

Stolio supports two rendering modes.

---

### Static Mode

Portfolio pages are statically generated using Next.js.

Benefits:

Fast loading
Low server cost
SEO friendly

---

### Dynamic Mode

Portfolios are rendered dynamically through server-side requests.

Benefits:

Real-time updates
Advanced features

Users may choose their preferred mode.

---

# 12. Security Considerations

Key security practices include:

Password hashing using bcrypt
Secure authentication tokens
Input validation on API endpoints
File upload sanitization

These measures ensure user data remains protected.

---

# 13. Performance Strategy

Performance is critical because portfolios will be publicly shared.

Optimization techniques include:

Static site generation
Image optimization
Lazy loading of animations
Efficient database queries

These strategies ensure fast loading portfolio pages.

---

# 14. Logging and Monitoring

The system will include monitoring and logging to ensure reliability.

Logging tools may include:

Application logs for API requests
Error monitoring services

This helps maintain system stability as usage grows.

---

# 15. Deployment Architecture

The platform will be deployed using modern cloud infrastructure.

Frontend Deployment:

Vercel

Backend Deployment:

Render or Railway

Database:

Managed PostgreSQL

AI Layer:

Ollama Cloud

---

# Architecture Summary

| Layer      | Technology        |
| ---------- | ----------------- |
| Frontend   | Next.js + React   |
| Backend    | Node.js + Express |
| Database   | PostgreSQL        |
| AI Layer   | Ollama Cloud      |
| Styling    | Tailwind CSS      |
| Animations | Framer Motion     |

---

# Technical Objectives

| Objective   | Description                          |
| ----------- | ------------------------------------ |
| Scalability | Support large numbers of portfolios  |
| Performance | Ensure fast page loads               |
| Modularity  | Separate AI, backend, and frontend   |
| Reliability | Maintain stable generation pipelines |

---

# Final System Summary

| Component        | Role                                   |
| ---------------- | -------------------------------------- |
| Frontend         | User interface and portfolio rendering |
| Backend          | Application logic and API services     |
| AI Engine        | Resume parsing and content generation  |
| Database         | User and portfolio storage             |
| Rendering Engine | Converts structured data to websites   |

---