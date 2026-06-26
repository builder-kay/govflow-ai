# GovFlow AI

**Government services made simple.** An AI Government Copilot for Ghana that turns confusing government procedures into clear step-by-step workflows.

Built for the CITSA × Cursor × Npontu Technologies hackathon.

## Quick Start

```bash
cd govflow-ai
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Flow

1. **Welcome** → Click "Get Started"
2. **Home** → Enter: *I want to start a small food delivery business in Cape Coast*
3. Click **Build My Roadmap**
4. Answer **5 smart questions**
5. View **Generated Roadmap** (6 steps)
6. Open **Checklist** → check off tasks
7. Run **Rejection Risk Checker**
8. **Upload** a mock FDA form → see document explanation
9. Open **Office Locator**
10. View saved progress in **My Roadmaps**

## Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn-style UI components
- Framer Motion (light animations)
- Zustand (state + localStorage persistence)
- Mock data — no API keys required

## Project Structure

```
src/
├── app/           # Pages (welcome, home, roadmap, checklist, etc.)
├── components/    # Reusable UI and feature components
├── data/          # Mock services, roadmap, offices, questions
├── lib/           # Utils + mock AI responses
├── store/         # Zustand app state
└── types/         # TypeScript interfaces
```

## Features

- AI-generated government roadmaps
- Smart checklists with "Why this matters"
- Document explainer (mock upload + analysis)
- Rejection-risk checker
- Office locator (Cape Coast)
- Progress tracker & saved roadmaps
- Accessibility settings (language, text size, contrast)

## Disclaimer

GovFlow AI helps users understand and prepare for government services. It does not replace official government agencies, legal advice, or official application portals.
