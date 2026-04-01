# MagentaAI Experience

MagentaAI Experience is a premium one-page interview prototype for a Senior AI Architect Consultant role at T-Systems. It is designed to show a dual-layer story:

- a customer-facing AI experience inspired by Telekom / Magenta AI
- the governed enterprise architecture required to deliver that experience safely at scale

The result is intentionally not a generic chatbot and not only a technical dashboard. It is an answer-engine-style experience that moves from intuitive UX to trust, architecture, operations, and consulting value, while keeping the interaction simple enough to demo in one smooth flow.

## Concept summary

This prototype demonstrates how a Telekom-style AI experience can evolve across three lenses:

1. Consumer mode: simple, elegant, guided answers with sources and voice/text interaction
2. Enterprise mode: the same answer flow, now with visible trust controls, policy framing, and governance context
3. Architect mode: the interaction expands into orchestration, retrieval, model gateway, operations, and scale controls

The core narrative is:

> Simple for people. Trusted for enterprises. Ready to scale.

## How this maps to public Magenta AI positioning

The public Magenta AI direction emphasizes a few important product ideas: AI inside an existing app journey, direct answers instead of link lists, prompt suggestions, citations, trustworthy behavior, and continuous feature evolution. This prototype mirrors those traits in a demo-friendly way:

- the centerpiece is a polished answer engine rather than a blank chat box
- the user can explore curated prompt flows instead of inventing everything from scratch
- each answer includes sources, confidence, follow-up suggestions, and a trust explanation
- voice and text modes share one integrated experience
- the experience stays premium and Magenta-led while showing that trust is built in, not layered on later

## Why the architecture reflects a Senior AI Architect Consultant perspective

The architecture is designed to show advisory depth as well as product understanding.

- It connects the visible AI experience to the platform layers behind it: channels, orchestration, retrieval, source systems, model gateway, governance, operations, and infrastructure.
- It treats governance, privacy, auditability, and human review as first-class design concerns.
- It includes the operating model needed for real production scale: canary rollout, traffic shaping, multi-model failover, tenant isolation, and evaluation loops.
- It closes with a transformation journey that positions the consultant as someone who can discover value, pilot responsibly, establish controls, industrialize the platform, and scale it across the enterprise.

In short, the prototype tries to answer the question: "What would it look like if this candidate had to advise the client and also design the platform that makes the experience safe and scalable?"

## Tech stack

- React + TypeScript + Vite
- Tailwind CSS
- Framer Motion
- lucide-react
- local Vite API middleware for server-side OpenAI calls
- OpenAI Responses API with a GPT mini model (`gpt-5.4-mini` by default)
- local shadcn-style UI components
- local mocked JSON data for prompts, responses, sources, trust controls, architecture, metrics, use cases, and journey stages
- automatic local fallback to scripted answers when no API key is set

## How to run

Create a local env file first:

```bash
cp .env.example .env.local
```

Then add your key to `.env.local`:

```bash
OPEN_API_KEY=your_openai_key_here
OPENAI_MODEL=gpt-5.4-mini
```

Then start the app:

```bash
pnpm install
pnpm dev
```

To create a production build:

```bash
pnpm build
```

## Demo structure

- Hero with a simpler value proposition and curated entry points
- Live demo panel with three modes and live server-backed answers
- Compact enterprise snapshot for trust, platform layers, and operations
- Use cases and consulting journey in a shorter, easier-to-scan layout
- Final executive CTA

## 10-minute presentation script

### 1. Start with the user experience inspired by Magenta AI

"I wanted to begin where a customer or digital user begins, not in the backend. The hero and feature layer show a Magenta-style answer experience: direct answers, prompt suggestions, sources, voice and text input, and a premium integrated feel."

### 2. Show answer engine behavior with sources and prompts

"The centerpiece is the live demo panel. This is not a generic chatbot. It uses curated prompt flows and scripted answers so the experience feels like an answer engine. Each answer is concise, source-backed, and gives the user clear follow-up options."

### 3. Switch to trust and governance

"The important point is that trust is visible in the product. When I move from consumer mode to enterprise mode, the same interaction starts exposing privacy mode, policy checks, audit logging, human review escalation, and regional controls. That is how an AI experience becomes enterprise-ready."

### 4. Reveal the architecture behind the experience

"Next I switch to architect mode and open the layered architecture. This is where the story expands from UI into platform design: channel integration, orchestration, retrieval, governed sources, model gateway, governance, operations, and sovereign infrastructure."

### 5. Show scale and operations controls

"A production-grade AI platform cannot stop at architecture diagrams. It needs an operating cockpit. That is why I included latency, groundedness, escalation, fallback, cost, and rollout controls such as canaries, traffic shaping, and evaluation loops. This shows how the platform would actually be steered in production."

### 6. Close with consulting value and transformation journey

"Finally, I wanted to show the consultant perspective. The transformation journey explains how I would help a client move from discovery to pilot to governance to industrialization to scale. The use-case cards show how the same platform thinking can support customer service, employees, operations, and regulated environments."

## Notes

- With a real `OPEN_API_KEY`, the demo sends questions through the local `/api/answer` endpoint and uses the GPT mini model server-side.
- If no key is present, the app falls back automatically to the local scripted dataset so the demo still works.
- The frontend is framed as a Perplexity-style answer experience, but the backend integration is OpenAI-based.
- The overall design now favors straightforward handling first, while still preserving the product, trust, and architecture story needed for the interview.
