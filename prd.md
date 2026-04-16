VibeReach: Product Requirements Document (PRD)
1. Project Overview
VibeReach is a lightweight outbound workspace designed to transform product pitches and business documents into highly personalized outreach strategies. Unlike traditional "spray and pray" tools, VibeReach focuses on context-aware lead discovery and hyper-personalized message generation without the legal and technical risks of automated scraping.

1.1 Problem Statement
Manual Outreach Inefficiency: Crafting personalized messages for LinkedIn or Email is time-consuming.

Context Gap: Existing tools often fail to connect the specific value proposition of a product with the specific pain points of a lead.

Scraping Risks: Traditional lead-gen tools rely on fragile and often non-compliant scraping techniques.

1.2 Solution
VibeReach bridges the gap between Product Context and Target Audience using AI. By analyzing uploaded documents (PDFs, Pitch Decks), it suggests who to look for, provides optimized search queries, and drafts tailored messages based on lead-specific analysis.

2. Target Audience
Lean GTM Teams: Sales and marketing teams looking for efficient, personalized outreach.

Founders & Entrepreneurs: Building early-stage traction with a focused value proposition.

Freelancers/Agency Owners: Seeking a structured way to manage multiple client outreach campaigns.

3. Functional Requirements
3.1 Authentication & User Management
Provider: Supabase Auth.

Features: Email/Password sign-up, login, password recovery, and secure session management.

3.2 Project Management (Workspaces)
Context Injection: Users can create projects by providing a product name, short pitch, and detailed description.

Document Parsing: Support for PDF uploads (up to 4MB). System extracts text to enrich the AI's understanding of the offer.

CRUD Operations: Create, rename, view, and delete outreach projects.

3.3 Lead Discovery (AI-Assisted)
Targeting Suggestions: Based on project context, AI suggests lead categories, roles, and geographies.

Optimized Search: Generation of specific LinkedIn search queries that users can copy-paste to find leads manually.

3.4 Lead Management & Analysis
Bulk Import: Users can paste multiple LinkedIn URLs to seed their lead list.

Batch Analysis: AI analyzes each lead against the project context to provide:

Fit Score: A qualitative assessment (High/Medium/Low).

Relevance Summary: Why this lead is a good match.

Outreach Angle: The recommended psychological or professional hook for the message.

3.5 Personalized Draft Generation
Multi-Channel Support: Generation of specific drafts for LinkedIn Connection Requests and Emails.

Tone Control: Ability to choose tone (Professional, Casual, Direct) and length.

Persistence: All generated drafts are saved to the database for future reference and iteration.

4. Technical Stack
Frontend: Next.js 14+ (App Router), TypeScript.

Styling: Tailwind CSS, shadcn/ui (Radix UI primitives).

Backend/Database: Supabase (PostgreSQL, Auth, Storage).

AI Engine: OpenAI API (GPT-4 / GPT-3.5) with fallback logic.

Deployment: Vercel.

5. UI/UX Design Principles
Minimalist & Modern: Clean, "product-grade" aesthetic with a focus on typography and whitespace.

Action-Oriented: A clear visual hierarchy that guides the user from "Pitch" to "Leads" to "Drafts".

Premium Feel: Implementation of modern UI patterns like Split-Screen Auth, Metrics Dashboards, and Interactive Steppers.

Responsive: Fully functional experience across Desktop, Tablet, and Mobile.

6. Database Schema (High-Level)
profiles: User metadata and settings.

projects: Core campaign data (pitches, goals, document references).

project_documents: Storage references for uploaded PDFs.

leads: Individual lead data, LinkedIn URLs, and AI-generated fit scores.

message_drafts: History of personalized messages generated for specific leads.

7. Future Roadmap
Chrome Extension: Direct lead import from LinkedIn profiles.

A/B Testing: Generate multiple message variations per lead to track performance.

Email/CRM Integration: Direct "Send to Gmail/Outlook" or "Export to HubSpot" functionality.

Multi-Language Support: Localized UI and draft generation in multiple languages.

8. Development & Deployment
CI/CD: Automated deployments via Vercel triggered by GitHub pushes.

Local Dev: npm run dev with environment variables for Supabase and OpenAI.