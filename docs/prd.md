---

# Stolio — Product Requirements Document (PRD)

## Product Overview (Human Explanation)

Stolio is an AI-powered platform that transforms a person’s resume or experience into a story-driven portfolio website. Instead of users manually designing websites, Stolio analyzes the information provided by the user—such as a resume, project descriptions, or professional experiences—and converts it into a structured narrative. That narrative is then rendered as an animated portfolio composed of reusable visual components.

The goal of Stolio is to make portfolio creation effortless while still producing websites that feel personal and unique. Traditional website builders require users to design layouts, select components, and manually write content. Stolio removes that complexity by letting the user focus only on their experience and identity, while the system automatically builds a complete portfolio presentation around it.

When a user signs up on Stolio, they can upload their resume or paste text describing their professional experience. The system processes this input using AI and converts it into structured data. This structured profile is then used to generate a portfolio website composed of sections such as a hero introduction, personal story, skills overview, projects showcase, timeline, and contact links.

The generated portfolio is not static content pasted into a template. Instead, it is assembled dynamically using an AI-generated Abstract Syntax Tree (AST) representing the UI. Every layout, color palette, typography choice, and animation is uniquely generated for the user based on their profile, ensuring no two portfolios can be replicated or look identical.

Users will also have the ability to explicitly prompt the AI to customize their portfolio. They can ask to transform the vibe (e.g. "make it cyberpunk"), change layouts (e.g. "change my skills section to a grid"), or modify specific text. The system updates the UI AST and rerenders the page dynamically.

Portfolios generated on Stolio are public by default and accessible through a shareable link. This makes them easy to send to recruiters, share on LinkedIn, or include in job applications. Each user can create up to two portfolios on the free plan, while additional portfolios will require a premium subscription.

Technically, Stolio will be built using Next.js for the frontend and Node.js for backend APIs. The system will support both static and dynamic portfolio generation. Static portfolios allow faster loading and scalability, while dynamic rendering allows advanced features if required. Users can choose their preferred output style depending on their needs.

The AI layer will be powered by models served through Ollama Cloud, allowing Stolio to handle resume parsing, content structuring, and narrative generation while maintaining control over model usage and costs.

Ultimately, the long-term goal of Stolio is to replace traditional resumes with interactive personal websites that better communicate a person’s work, personality, and professional journey.

---

# Product Role

Stolio functions as an **AI-powered portfolio generation platform** designed to automate the creation of professional portfolio websites.

Its role is to bridge the gap between resumes and personal websites by converting structured career information into interactive, story-based web experiences.

---

# Product Context

Professionals increasingly need personal websites or portfolios to showcase their work. However, building such sites requires design knowledge, development skills, or the use of complicated website builders.

Existing tools often fall into two categories:
• Website builders that require manual design
• Resume tools that produce static documents

Neither approach effectively communicates a person’s professional journey or individuality.

Stolio operates in the space between these two approaches by combining AI-driven narrative generation with automated website construction. It enables users to generate polished portfolio websites without requiring any design or coding skills.

---

# Product Objective

The primary objective of Stolio is to allow users to generate a fully functional portfolio website within minutes by simply providing their professional information.

Key objectives include:

1. Automate the transformation of resumes into structured portfolio content.
2. Provide visually distinctive portfolio styles using modern UI trends.
3. Allow users to easily edit and regenerate portfolio sections.
4. Enable users to share public portfolio links for professional visibility.
5. Create a scalable platform that can evolve into a long-term personal identity system.

---

# Target Users

The primary users of Stolio are individuals who need professional portfolios but lack the time or expertise to build them manually.

### Primary Users

• Engineering students
• Junior developers
• Designers and creators
• Freelancers

### Secondary Users

• Startup founders
• Researchers
• Job seekers in tech and creative fields

---

# Core Features (MVP)

## Resume Input

Users can provide their professional information using two methods.

Text Input
Users paste resume text, LinkedIn summaries, or experience descriptions.

File Upload
Users upload resumes in PDF or DOCX format.

The system extracts relevant information and converts it into structured data.

---

## AI Narrative Generation

After parsing the user’s data, the system generates a narrative structure for the portfolio. This includes:

• professional tagline
• personal introduction
• summarized career journey
• structured project descriptions

The generated content becomes the foundation of the portfolio.

---

## Portfolio Generation

Stolio assembles portfolio pages using predefined animated components.

Typical portfolio structure includes:

Hero Section
User name, tagline, quick introduction.

About Section
Narrative summary of the user’s journey.

Skills Section
Technical or professional capabilities.

Projects Section
Highlighted projects or work.

Timeline Section
Education and professional history.

Contact Section
Links and social profiles.

---

## Generative UI Engine

Instead of templates or fixed visual styles, Stolio uses a **Generative UI Engine**.
The AI evaluates the user's content and returns a structured UI JSON describing:

• The exact layout components (grids, flex rows, carousels)
• Color palettes, typography, and spacing
• Background effects (translucency, gradients, noise)
• Interactions and animations

Because the styling and structure are determined parametrically by the AI for each session, every portfolio is guaranteed to be entirely unique and bespoke to the individual user.
---

## Theme Preferences

Users can choose a visual preference before building their portfolio:

Light mode only
Dark mode only
Mixed light/dark

Dark mode will be supported by default.

---

## Portfolio Editing

Users can update their portfolios after generation.

Editing methods include:

• prompt-based AI edits
• updating structured fields (bio, projects, skills)

The system regenerates affected sections after edits.

---

## Portfolio Limits

Free plan users can create up to two portfolios.

Users can delete and regenerate portfolios up to three times.
After this limit, regeneration is restricted unless the user upgrades.

---

## Portfolio Publishing

Portfolios are public and accessible through customizable URLs.

Example:

stolio.site/username

Users can share these links with recruiters or include them in applications.

---

# Non-MVP Features (Future)

The following features are intentionally excluded from the initial version:

GitHub auto-sync
AI portfolio chat assistant
Recruiter analytics
Custom domains
Drag-and-drop page builder
Advanced portfolio analytics

These features may be introduced in later versions.

---

# Technical Architecture (Summary)

Frontend
Next.js with React for rendering portfolio pages.

Backend
Node.js API server handling user accounts, portfolio data, and generation requests.

Database
PostgreSQL storing user profiles and portfolio data.

AI Layer
Ollama Cloud models handling resume parsing and narrative generation.

Rendering System
Component-based architecture that assembles portfolio pages from structured data.

---

# Data Model Overview

Core portfolio data structure:

Portfolio
Name
Tagline
Bio
Skills list
Projects list
Experience timeline
Contact links
Visual style
Theme preference

This structured format ensures the frontend can render portfolios consistently.

---

# Key Success Metrics

The success of Stolio will be measured through:

Number of portfolios generated
Portfolio share rates
User retention after generation
Conversion from free plan to premium plan
Average portfolio completion rate

---

# Constraints

Several constraints guide the development of Stolio.

AI generation must remain cost-efficient.
Portfolio rendering must remain fast and scalable.
The system must support both static and dynamic site generation.
User experience should remain simple and non-technical.

---

# Risks

Possible risks include:

AI producing inaccurate or generic content.
Performance issues caused by heavy animations.
Users expecting full website builder functionality.

These risks will be mitigated by limiting scope and focusing on automated storytelling.

---

# Roles and Responsibilities

| Role             | Responsibility                                    |
| ---------------- | ------------------------------------------------- |
| Product Owner    | Defines vision and product scope                  |
| Engineering Team | Builds frontend, backend, and AI pipeline         |
| Design Team      | Creates UI styles and animation systems           |
| AI System        | Processes resumes and generates portfolio content |

---

# Context Summary

| Element            | Description                                         |
| ------------------ | --------------------------------------------------- |
| Product Name       | Stolio                                              |
| Category           | AI portfolio generation platform                    |
| Core Idea          | Convert resumes into interactive portfolio websites |
| Primary Technology | Next.js, Node.js, Ollama AI                         |
| Target Users       | Students, developers, freelancers                   |

---

# Objective Summary

| Objective       | Description                                    |
| --------------- | ---------------------------------------------- |
| Automation      | Automatically generate portfolios from resumes |
| Personalization | Create unique story-based experiences          |
| Accessibility   | Allow non-designers to build portfolios        |
| Scalability     | Support large numbers of portfolio sites       |

---

# Feature Summary Table

| Feature                 | MVP Status      |
| ----------------------- | --------------- |
| Resume upload           | Included        |
| Text input              | Included        |
| AI narrative generation | Included        |
| Portfolio styles        | Generative AI Layouts |
| Dark mode support       | Included        |
| Prompt editing          | Included        |
| Public portfolio URLs   | Included        |
| Portfolio limit         | 2 for free plan |

---

