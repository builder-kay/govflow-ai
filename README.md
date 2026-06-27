# GovFlow AI

**Government services made simple.** An AI Government Copilot for Ghana that turns confusing government procedures into clear step-by-step workflows.

Built for the CITSA × Cursor × Npontu Technologies hackathon.

## OpenAI Agent Builder Integration

GovFlow AI uses **OpenAI Agent Builder** via **ChatKit** for the live AI assistant.

### Setup

1. Build and publish your agent workflow in [OpenAI Agent Builder](https://platform.openai.com/agent-builder)
2. Copy your **workflow ID** (starts with `wf_`)
3. Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

4. Add your credentials:

```env
OPENAI_API_KEY=sk-your-key
NEXT_PUBLIC_CHATKIT_AGENT_ID=wf_your_workflow_id
```

5. Restart the dev server

### Where the agent appears

- **Floating chat button** — compact Agent Builder chat on every page
- **`/assistant`** — full-screen chat with file upload for document explanation
- **Home** — "Ask AI Assistant" sends your query to the agent

The session API at `/api/chatkit/session` securely exchanges your workflow ID for a short-lived client secret. User context (location, active service, language) is passed as workflow state variables.

Without env vars configured, the app falls back to mock responses for demo mode.

## Quick Start

```bash
cd govflow-ai
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Phase 2: Python Translation Service

GovFlow can use a separate Python microservice for translation/recognition experiments.

1. Start the translation service:

```bash
cd services/translation-service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
set GHANA_NLP_API_KEY=your_real_key_here
python main.py
```

2. In app `.env`, set:

```env
GHANA_NLP_SERVICE_URL=http://127.0.0.1:8001
```

3. Restart Next.js.

When `GHANA_NLP_SERVICE_URL` is set, `/api/translation/*` calls the microservice first.
If it is empty, GovFlow uses direct Khaya API mode.

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
