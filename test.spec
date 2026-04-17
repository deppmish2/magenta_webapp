The prototype represents Telekom's values, T-Systems' vision and portfolio in the field of AI & data, and demonstrates AI through a live interactive experience.

## Sections

1. **Overview** — Hero section with headline, four highlighted values as badges, and a card summarising what the prototype covers.
2. **Values** — Four Telekom values displayed as cards: Human-centered, Trustworthy, Sovereign, Impactful.
3. **Vision** — T-Systems vision expressed in three pillars: AI inside real journeys, Data + governance together, From pilot to scale. Includes a single-line vision statement.
4. **Portfolio** — Four AI & data portfolio areas, each with a button that opens the matching scenario directly in the live demo: Customer Service AI, Sovereign AI, Enterprise Workspace, AI Operations at Scale.
5. **AI Demo** — Live answer panel with scripted scenario selection, free-form text input, voice mode UI, and a structured answer output.

## AI Demo requirements

- At least four scripted prompt scenarios covering the portfolio areas.
- Typing animation on the executive summary.
- Source citation cards with title, kind, freshness badge, and snippet.
- Trust cues panel with trust reason text and trust badges.
- Follow-up suggestion chips that trigger a new query when clicked.
- "Show architectural trace" button that reveals five stages: Retrieval, Policy checks, Orchestration, Model gateway, Monitoring.
- Voice mode UI with microphone pulse animation (simulated, no real audio required).
- OpenAI-backed live answer when an API key is configured, scripted fallback otherwise.
- Status message indicating whether the response is live or scripted.
- Confidence score displayed alongside the answer title.

## Design constraints

- Dark background, magenta accent colour throughout.
- Premium, executive-friendly copy — concise and presentation-ready.
- Smooth entry animations (framer-motion).
- Sticky navigation with section links and a "Live Demo" CTA.
- No raw admin dashboard aesthetics; the operations and trust UI must look polished.
