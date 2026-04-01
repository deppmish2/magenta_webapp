Build a premium demo web app called MagentaAI Experience.

Purpose:
This is an interview prototype for a Senior AI Architect Consultant role at T-Systems.
The app must demonstrate both:
1. a customer-facing AI experience inspired by Telekom / Magenta AI
2. the enterprise-scale architecture and governance required to deliver it safely at scale

Critical interpretation:
Do NOT build a generic chatbot.
Do NOT build only a technical dashboard.
Build a dual-layer experience:
- simple, elegant, Magenta-branded AI interaction on the surface
- architect-grade scalability, trust, governance, and operations underneath

Product inspiration to reflect:
The public Telekom / Magenta AI experience shows these product traits:
- integrated into an existing digital app experience
- answer engine rather than search result links
- real-time information retrieval
- source citations
- prompt suggestions
- voice or keyboard input
- safe, simple, intuitive UX
- secure and trustworthy environment
- continuous evolution of features
- partnership-based AI integration (e.g. Perplexity-style answer experience)

Core concept:
MagentaAI Experience  trusted AI interaction, designed for enterprise scale.

Narrative:
The app should show how Telekom-style AI can evolve from:
- intuitive customer AI
to
- trusted enterprise AI
to
- governed, scalable AI architecture for telco and regulated industries

Audience:
- T-Systems interview panel
- enterprise architects
- CIO / CTO / CDO stakeholders
- regulated-industry customers
- AI transformation leaders

Design direction:
- dark premium UI
- magenta-first brand accents
- clean, modern, executive-demo quality
- not playful, not consumer-only, not overengineered
- subtle motion with Framer Motion
- Tailwind CSS
- TypeScript
- React or Next.js
- use shadcn/ui components
- use lucide-react icons
- desktop-first but responsive

Main app structure:
One-page immersive demo with anchored sections and one central interactive AI panel.

Sections:

1. HERO
Headline:
MagentaAI Experience
Subheadline:
Simple for people. Trusted for enterprises. Ready to scale.
Primary CTAs:
- Try Live Demo
- View Architecture
Visual:
- premium animated magenta glow / network pulse background
- short value badges:
  - Real-time answers
  - Cited responses
  - Voice + text input
  - Trusted AI controls
  - Enterprise scale

2. WHAT MAGENTA AI FEELS LIKE
Goal:
Translate the public Magenta AI product idea into UX.
Include a row of feature cards:
- Ask naturally
- Get direct answers
- See sources
- Discover suggested prompts
- Use voice or text
- Stay in one app
Each card should be minimal and polished.

3. LIVE MAGENTA AI DEMO (CENTERPIECE)
Build the main interactive demo area.

Layout:
- left sidebar: suggested prompts / modes / recent topics
- center: conversational AI answer panel
- right sidebar: sources, trust checks, controls

Behavior:
- user can click prompt chips or type in a question
- user can toggle input mode between Text and Voice
- answer should appear with:
  - concise executive summary
  - detailed answer
  - source cards
  - confidence / trust badges
  - follow-up suggestions

Prompt ideas:
Consumer / telco style:
- What are the best roaming options for a business traveler in the EU?
- Explain 5G campus networks in simple terms.
- What changed in our contract support options?
Enterprise / architect style:
- Design a secure AI assistant for telecom customer service.
- How can we deploy an answer engine with EU data residency?
- What controls are needed before rolling out GenAI to millions of users?
- Compare retrieval-augmented generation with direct web answer systems.

Important:
Use mocked responses, but make them feel real.
Implement 68 polished scripted prompt flows with realistic logic.
Every answer should include sources and trust indicators.
This must feel like an answer engine, not a random LLM chat box.

4. DISCOVER / SUGGESTED PROMPTS SECTION
Inspired by the discover and prompt suggestion angle.
Create a visually rich strip or grid of topic cards such as:
- AI for customer experience
- Sovereign AI
- AI in telecom operations
- AI for public sector
- Responsible AI
- AI copilots for employees
When clicked, they preload a related prompt into the main demo.

5. TRUSTED AI PANEL
Create a dedicated section showing why this AI is safe and enterprise-grade.
Use cards or control tiles for:
- Source grounding: on
- Privacy mode: on
- Human review escalation: on
- Policy checks: passed
- Audit logging: active
- Regional deployment: EU / Germany
- Content safety filters: active
- PII protection: active
- Response traceability: enabled
This section should visually connect the simple UX to enterprise trust.

6. FROM EXPERIENCE TO ARCHITECTURE
Create an architecture section that expands the live demo into a scalable platform view.

Show an interactive layered architecture diagram with these layers:
- Channels: app, web, contact center, employee copilot
- Experience layer: chat UI, voice input, prompt suggestions
- AI orchestration layer: prompt routing, session memory, tool execution
- Retrieval layer: search, vector retrieval, policy-aware grounding
- Source layer: web, knowledge base, contracts, service docs, product catalogs
- Model gateway: model routing, fallback logic, cost controls
- Governance layer: guardrails, compliance, human approval, redaction
- Operations layer: monitoring, evals, feedback, A/B testing, incident handling
- Infrastructure layer: sovereign cloud / multi-region / tenant-aware deployment

Each layer should be clickable and reveal:
- what it does
- why it matters
- how it scales
- what the architect must design for

7. SCALE & OPERATIONS DASHBOARD
This is where the Senior AI Architect Consultant angle becomes obvious.
Create a polished metrics/control section showing:
- active sessions
- p95 latency
- retrieval success rate
- answer groundedness
- human escalation rate
- cost per 1k requests
- top intents
- cache hit ratio
- regional traffic split
- model fallback events

Also show control concepts:
- canary rollout
- traffic shaping
- rate limiting
- multi-model failover
- tenant isolation
- observability / tracing
- evaluation loop

Important:
This should not look like a DevOps-only dashboard.
It should look like a strategic AI operations cockpit.

8. TELCO / ENTERPRISE USE CASES
Create 4 use-case cards:
- Customer Service Copilot
- Employee Knowledge Assistant
- Network Operations Assistant
- Regulated Enterprise AI Workspace

Each card should show:
- business problem
- AI workflow
- trust requirements
- scaling considerations
- expected business outcome

Example scaling considerations:
- millions of users
- burst traffic
- multilingual responses
- secure retrieval
- auditability
- regional compliance

9. CONSULTING VALUE / TRANSFORMATION JOURNEY
This section should reflect the consultant role, not just technical execution.
Show a transformation journey:
- Discover
- Pilot
- Govern
- Industrialize
- Scale

For each stage show:
- client concern
- architectural focus
- deliverable
- success metric

This helps position the candidate as someone who can advise and implement.

10. FINAL CTA / EXECUTIVE SUMMARY
End with a strong statement:
From intuitive AI experiences to governed AI platforms at scale.
Buttons:
- Replay Demo
- View Architecture
- Explore Use Cases

Content tone:
- concise
- strategic
- enterprise credible
- future-oriented
- human-centered
- not full of buzzwords

Data model:
Create local JSON files for:
- suggested prompts
- scripted responses
- source citations
- architecture layers
- trust controls
- ops metrics
- use cases
- transformation stages

Interaction requirements:
- smooth scrolling
- sticky nav
- keyboard accessible
- responsive
- tasteful motion only
- loading and typing states
- tabbed switching between Experience, Trust, and Architecture views
- tooltips for metrics and architectural controls

Demo mechanics:
Create 3 demo modes:
1. Consumer mode
   - simple questions
   - lighter trust panel
2. Enterprise mode
   - grounded answers + governance details
3. Architect mode
   - reveals architecture, metrics, rollout, controls

This mode switch is very important.
It shows evolution from user experience to platform design.

Must-have technical storytelling points embedded in UI:
- direct answers instead of link lists
- source-backed responses
- one integrated experience
- voice/text multimodal interaction
- safe and intuitive user journey
- continuous feature evolution
- AI that can scale from pilot to production
- trust, governance, and operations are first-class design concerns

Nice-to-have:
- fake microphone animation for voice mode
- animated source citation reveal
- a why this answer is trustworthy drawer
- a show architectural trace action that maps answer generation to system components
- a compare toggle: basic chat UI vs MagentaAI enterprise answer engine
- subtle bilingual labels (EN primary, optional DE accents)

Avoid:
- generic ChatGPT clone
- too much lorem ipsum
- irrelevant KPI spam
- cartoon visuals
- backend complexity that wont demo well
- generic cloud architecture disconnected from the user experience

Deliverables:
- polished working prototype
- modular component structure
- local mocked data
- clean README

README must include:
1. concept summary
2. how this maps to public Magenta AI positioning
3. why the architecture reflects a Senior AI Architect Consultant perspective
4. how to run
5. a 10-minute presentation script

Presentation script in README:
1. Start with the user experience inspired by Magenta AI
2. Show answer engine behavior with sources and prompts
3. Switch to trust and governance
4. Reveal the architecture behind the experience
5. Show scale/operations controls
6. Close with consulting value and transformation journey

Success criteria:
The panel should feel:
- this looks like Magenta / Telekom
- this candidate understands product + architecture
- this is not just AI hype, it is scalable and governable
- this person can advise enterprise clients and design production AI systems
