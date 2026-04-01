# MagentaAI Experience

MagentaAI Experience is a polished one-page interview demo for a Senior AI Architect Consultant conversation. The app is intentionally presentation-first:

- premium dark, magenta-forward visual language
- one immersive page instead of multiple disconnected screens
- local mocked data only for demo reliability
- concise executive copy
- a mode switch that changes the story from customer UX to enterprise governance to platform architecture

The runtime remains Vite-based, so the shipped implementation lives in `src/`. For spec alignment, there is also an `app/page.tsx` compatibility entry that mirrors the same app component.

## What the app now does

The page is built around one answer engine experience with three lenses:

1. Consumer mode shows the polished front-end story: guided prompts, voice demo UI, direct answers, citations, and follow-up suggestions.
2. Enterprise mode keeps the same answer surface but turns up trust controls, residency, audit posture, and rollout signals.
3. Architect mode reveals the presentable platform layer story: orchestration, retrieval, gateway policy, monitoring, and the clickable architecture explorer.

The demo is intentionally local-only and scripted. There is no dependency on an external API to make the main flow feel complete.

## Structure

- `src/App.tsx`: top-level page composition and global mode state
- `src/components/StickyNav.tsx`: sticky navigation with compact mode switch
- `src/components/ModeSwitch.tsx`: reusable consumer / enterprise / architect switch
- `src/components/SectionWrapper.tsx`: reusable section shell for the one-page layout
- `src/components/LiveAnswerPanel.tsx`: scripted live demo with typing animation, fake voice mode, citations, follow-ups, and architectural trace
- `src/components/TrustControlsPanel.tsx`: trust controls and evidence cards
- `src/components/ArchitectureLayerExplorer.tsx`: clickable architecture layer explorer
- `src/components/OperationsCockpit.tsx`: premium operations and rollout cockpit
- `src/components/UseCaseCards.tsx`: use-case cards
- `src/components/TransformationJourneyTimeline.tsx`: consulting journey timeline
- `src/data/*.json`: mocked prompts, answers, citations, controls, architecture, metrics, use cases, and transformation stages
- `src/data/demoContent.ts`: typed helpers and mode-specific presentation content

## Run locally

```bash
pnpm install
pnpm dev
```

Create a production build with:

```bash
pnpm build
```

## Demo walkthrough

The page is designed to support a single smooth 10-minute walkthrough:

1. Start in the hero.
   Explain that this is a premium Magenta-style AI answer engine, not a generic chatbot, and use the large mode switch to frame the conversation.

2. Enter the live demo.
   Pick one of the scripted prompts, show the voice demo pulse, submit the question, and let the typing animation land the executive summary.

3. Show why the answer feels trustworthy.
   Point to the citation cards, trust badges, concise rationale, and follow-up suggestions on the same surface.

4. Reveal the architectural trace.
   Click `Show architectural trace` and walk through retrieval, policy checks, orchestration, model gateway, and monitoring.

5. Switch to enterprise mode.
   Show how the same answer surface changes character: more visible controls, stronger governance posture, and a cleaner rollout narrative.

6. Open the trust and architecture section.
   Use the trust controls to talk about policy, privacy, escalation, and auditability. Then click through the architecture explorer live so the platform story feels clear and deliberate.

7. Move into the operations cockpit.
   Highlight that this is not a raw admin dashboard. It is a presentable control room for groundedness, latency, cost, failover, canaries, and regional posture.

8. Close with use cases and journey.
   Show how the same platform thinking supports customer service, employee knowledge, operations, and regulated environments. Finish on the transformation journey from discover to scale.

## Suggested 10-minute talk track

### 1. Open with the product feel

"I wanted the first impression to be a believable Magenta-style answer experience, not a technical diagram. The page starts with a premium consumer-ready interaction and then reveals the operating layers underneath."

### 2. Demonstrate the live answer flow

"The center of the experience is a scripted answer engine. I can choose one of several prompt flows, trigger a fake voice interaction for demo polish, and show a concise answer with sources and follow-up suggestions."

### 3. Explain the mode switch

"The same page transforms across three modes. Consumer mode emphasizes clarity. Enterprise mode makes governance visible. Architect mode opens up the platform logic behind the experience."

### 4. Show trust directly in the product

"Trust is not hidden in a slide appendix. The answer includes confidence, citations, trust badges, and a short explanation of why the response is safe to rely on."

### 5. Reveal the architectural trace

"When I click the architectural trace, the app explains how the answer moved through retrieval, policy checks, orchestration, the model gateway, and monitoring. That makes the enterprise platform story concrete."

### 6. Click through the architecture explorer

"The architecture section is intentionally presentable and clickable. Instead of showing one static diagram, I can move through the stack layer by layer and explain how each part contributes to trust, scale, and operational control."

### 7. Use the operations cockpit to show production credibility

"The cockpit shows the difference between a nice pilot and a real platform. I can talk about canaries, model failover, groundedness, cost, and regional posture without drowning the audience in dashboard clutter."

### 8. Finish with consulting value

"I close with the use cases and the transformation journey because the goal is not only to show UI taste or platform depth. It is to show how I would help a client move from opportunity discovery to governed enterprise scale."

## Design intent

- premium, dark, magenta-forward styling
- stronger spacing and hierarchy than the previous prototype
- less clutter, more narrative discipline
- believable enterprise copy without long paragraphs
- smooth transitions between sections
- interview-safe reliability through local mocked data only

## Notes

- The existing repository still contains some earlier prototype files and server-side scaffolding, but the implemented app flow is now fully local and does not depend on those services.
- `app/page.tsx` is present for spec alignment; the actual runtime entry for this repo remains `src/App.tsx`.
