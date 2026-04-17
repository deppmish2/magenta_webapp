Build a premium, single-page web app prototype called “MagentAI Experience” for an interview presentation for a Senior AI Architect / Consultant role at T-Systems.

Goal:
Create a polished, executive-grade enterprise AI showcase that demonstrates how T-Systems could position “MagentAI Experience” as the front door to enterprise AI transformation. The app should feel like a strategic product vision plus interactive demo, not a generic chatbot and not a hackathon toy.

Core narrative:
This prototype should communicate that T-Systems helps enterprises move from AI idea to prototype to governed production deployment at scale. The app should make clear, through UI and interaction, that the offering includes:
- AI use case discovery
- enterprise data integration
- governed GenAI deployment
- secure and sovereign AI
- production-grade AI architecture
- transformation from pilot to scale

Design direction:
- Dark theme by default
- Premium magenta accent color and glow effects
- Clean enterprise dashboard aesthetic
- Modern typography
- Smooth but restrained animations
- Glassy or elevated cards, but still corporate and credible
- Spacious layout
- Consulting-grade presentation feel
- Avoid cartoonish visuals, startup gimmicks, or playful consumer chat design

Tech stack:
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- shadcn/ui
- lucide-react
- Recharts
- local mock data only, no real backend required

General requirements:
- Single-page application with smooth scrolling
- Sticky top navigation with anchor links to sections
- Fully responsive
- Clean component structure
- Typed mock data
- Reusable components
- Subtle loading states and hover states
- Visually impressive enough for a 10-minute live demo
- Make it look like it was designed by a senior architect who understands enterprise AI systems and scale

Main sections to build:

1. Hero section
Create a visually strong hero section with:
- Title: “MagentAI Experience”
- Subtitle options like:
  “AI at Scale. Human at Heart.”
  “From Enterprise Data to Trusted AI Outcomes.”
  “Prototype fast. Govern deeply. Scale confidently.”
- Supporting text explaining that the experience turns enterprise knowledge, workflows, and systems into trusted AI capabilities
- Primary CTA: “Launch AI Demo”
- Secondary CTA: “Explore Use Cases”
- Tertiary CTA: “View Architecture”
- Animated magenta gradient background or subtle network/data motif
- A premium mock dashboard preview or layered floating cards on the right side if layout allows

2. Value pillars section
Create 4 premium cards for:
- Discover
  Find high-value AI opportunities fast
- Build
  Prototype assistants, copilots, and enterprise workflows
- Govern
  Apply controls, oversight, compliance, and policy
- Scale
  Move from pilot to production with platform architecture
Each card should have:
- icon
- title
- short explanation
- subtle hover animation

3. Industry use case explorer
Create an interactive section with either tabs, segmented controls, or cards for industries:
- Telecom
- Finance
- Public Sector
- Manufacturing
- Healthcare

For each industry, display 3 to 5 enterprise AI use cases with:
- use case name
- short summary
- business impact
- trust/governance tags

Examples:
Telecom:
- customer support copilot
- network incident summarization
- churn insight assistant
- field service assistant

Finance:
- regulatory knowledge assistant
- fraud operations copilot
- document intelligence for compliance
- internal policy assistant

Public Sector:
- citizen support assistant
- case summarization
- document search and retrieval
- service workflow guidance

Manufacturing:
- maintenance knowledge assistant
- anomaly insight engine
- quality operations copilot

Healthcare:
- admin workflow assistant
- clinical document summarization
- patient service guidance assistant

Display each use case in polished cards. When user switches industry, animate content change.

4. Interactive AI demo section
This is the centerpiece of the app.

Create a large section titled something like:
- “Interactive Enterprise AI Demo”
- “See MagentAI in Action”

Add 3 selectable demo modes:
- Executive Copilot
- Talk to Your Data
- Sovereign AI Advisor

A. Executive Copilot mode
Show sample prompts such as:
- Where can AI reduce service costs in our customer support operation?
- Summarize the top 3 AI opportunities in our telecom service stack.
- What is the roadmap from pilot to production?

When a sample prompt is clicked:
- show a short animated loading state
- return a structured enterprise-style response
Response format should include:
- title
- executive summary
- key findings
- recommended next steps
- business impact
- risks and dependencies
- governance notes

B. Talk to Your Data mode
Show sample prompts such as:
- Why did churn increase in the enterprise segment last quarter?
- Summarize incidents by region and suggest actions.
- Which operational KPIs need attention this month?

When clicked:
- render a structured response panel
- also show supporting KPI widgets or a simple chart
- include insight summary, likely causes, and recommended actions

C. Sovereign AI Advisor mode
Show sample prompts such as:
- Can this use case run under EU data residency requirements?
- What controls are needed before rollout?
- How do we keep human oversight in place?

When clicked:
- return a governance-centric answer with:
  - deployment recommendation
  - risk flags
  - required controls
  - human-in-the-loop guidance
  - compliance posture
  - suggested hosting mode

Important:
All AI responses should be local mock responses defined in structured TypeScript data. No real model integration is needed. The experience should still feel realistic and credible.

5. Architecture section
Create a strong architecture section titled:
- “Reference Architecture for Enterprise AI at Scale”

Display a layered architecture diagram or stacked architecture cards with 5 layers:

Layer 1: Experience Layer
- executive dashboard
- AI assistant UI
- use case explorer
- analytics views

Layer 2: AI Orchestration Layer
- prompt routing
- agent workflows
- retrieval orchestration
- structured output handling
- policy enforcement

Layer 3: Enterprise Data Layer
- document repositories
- CRM and ERP systems
- data warehouse
- event streams
- knowledge bases

Layer 4: Trust and Governance Layer
- audit logging
- access control
- evaluation and monitoring
- guardrails
- human approval
- data residency controls

Layer 5: Runtime and Platform Layer
- cloud / sovereign cloud
- model serving
- vector store
- observability
- API gateway
- CI/CD pipeline

Make the architecture visually polished. Each layer should have expandable details or hover states if feasible.

6. Governance and sovereignty section
Create a dedicated trust section titled:
- “Trusted AI by Design”
or
- “Sovereign and Governed AI”

Display a grid of control badges or cards such as:
- EU data residency
- auditability
- explainability
- human review
- role based access
- policy enforcement
- observability
- fallback controls
- model monitoring
- secure integration

This section should feel important, not decorative. It should signal that the platform is built for regulated and enterprise settings.

7. Delivery journey section
Create a horizontal journey or timeline section:
Strategy → Prototype → Pilot → Production → Scale

For each stage, show:
- what is delivered
- technical maturity
- governance maturity
- business outcome maturity

Example:
Strategy:
- identify opportunities
- assess data readiness
- define risks and value

Prototype:
- demo selected use cases
- validate UX and workflow
- prove business relevance

Pilot:
- connect limited enterprise systems
- test guardrails and observability
- capture usage metrics

Production:
- deploy with monitoring
- integrate governance controls
- establish human oversight

Scale:
- multi-use-case rollout
- platform reuse
- cost and performance optimization

8. Final executive CTA section
Create a polished closing banner with messaging like:
“Turn AI ambition into trusted enterprise outcomes”
Supporting points:
- rapid value discovery
- secure deployment
- governed integration
- scalable architecture

Add a final CTA button like:
- “Start the Transformation”
or
- “Design Your AI Journey”

Behavior and UX details:
- Smooth scroll between sections
- Sticky nav with active section highlight
- Sections should animate into view
- Cards should have polished hover states
- Demo prompts should be clickable chips or buttons
- AI response panel should feel premium and structured
- Charts should be simple, elegant, and readable
- Avoid clutter
- Prioritize presentation clarity over too many features

Content tone:
- concise
- executive
- enterprise credible
- transformation-oriented
- avoid exaggerated marketing language
- avoid consumer SaaS tone

Folder structure:
Use a clean componentized structure like:

src/
  app/
    page.tsx or main app entry
  components/
    layout/
      Navbar
      SectionWrapper
    sections/
      HeroSection
      ValuePillarsSection
      UseCaseExplorerSection
      AiDemoSection
      ArchitectureSection
      GovernanceSection
      DeliveryJourneySection
      FinalCtaSection
    ui/
      PillarCard
      UseCaseCard
      DemoModeTabs
      PromptChip
      ResponsePanel
      KpiWidget
      ArchitectureLayerCard
      GovernanceBadge
      JourneyStepCard
  data/
    industries.ts
    demoPrompts.ts
    demoResponses.ts
    architecture.ts
    governance.ts
    journey.ts
  types/
    index.ts

Type definitions:
Create TypeScript interfaces for:
- Industry
- UseCase
- DemoMode
- DemoPrompt
- DemoResponse
- ArchitectureLayer
- GovernanceControl
- JourneyStage
- KpiMetric

Suggested visual details:
- gradient borders on active cards
- glow effect on CTA buttons
- blur and glassmorphism used lightly
- magenta highlights for active tabs and filters
- subtle animated background particles or network lines in hero
- charts with restrained enterprise styling
- architecture section with elegant stacked layout
- premium shadows and rounded corners

Important constraints:
- No authentication
- No backend required
- No real API integration
- No overcomplicated state management
- Keep it interview-demo friendly
- Focus on visual polish and narrative strength
- Make the app easy to present in 10 minutes

Key outcome:
The final prototype should make an interviewer think:
“This candidate understands how to turn enterprise AI strategy into a credible, governed, scalable product and platform experience.”

Also generate thoughtful mock content so the app is presentation-ready without requiring manual editing.