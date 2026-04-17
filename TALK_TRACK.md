# MagentAI Experience — 10-Minute Interview Talk Track

> **How to use this:** Read it once. Then present from memory.
> Italic lines are stage directions — what to click or scroll to.
> Bold text is the phrase that matters most in each beat.
> When the interviewer reacts or interrupts — stop and have the conversation. That is the win.

---

## [0:00 – 0:30] Opening — The decision I made first

*App is open on the hero. Nothing is playing. Let it breathe for two seconds.*

> "Before I walk you through the app, I want to tell you the decision I made at the start.
>
> The brief said create a prototype that represents Telekom's values, T-Systems' vision, and demonstrates AI. That could mean a lot of things.
>
> **I decided to build a client-facing product demo** — not a proof of concept, not a hackathon toy. Something a senior architect at T-Systems could actually open in front of a CTO and narrate confidently.
>
> Everything in the app flows from that single decision."

---

## [0:30 – 1:15] Hero — What the app is

*Point at the headline and the three CTAs. Do not click anything yet.*

> "The app is called MagentAI Experience. The tagline is **'AI at Scale. Human at Heart.'** — which is the tension T-Systems needs to hold. Serious enterprise AI, still human and usable.
>
> Three entry points: launch the demo, explore use cases, or go straight to the architecture. I'll take you through all three.
>
> On the right you can see floating stat cards — production-grade, EU sovereign, 8 to 12 weeks to pilot. These are not marketing claims. They become concrete as we go through the app."

*Scroll slowly past the hero.*

---

## [1:15 – 1:45] Value Pillars — The consulting frame

*Pause on the four cards: Discover, Build, Govern, Scale.*

> "The value pillars frame the T-Systems proposition in four words: Discover, Build, Govern, Scale.
>
> These are not marketing categories. They are the **four things a client actually needs** on the path from AI idea to production deployment.
>
> I deliberately chose these over Telekom's brand values here — because in a client room, the question is 'what do you do for us', not 'what do you stand for'. The brand values show up in the experience design, not in this section."

*Scroll on.*

---

## [1:45 – 2:20] Industry Use Cases — Showing breadth fast

*Click the Telecom tab. Point at 2–3 use case cards.*

> "The use case explorer covers five industries. I'll stay on Telecom since that's the home ground.
>
> Each card has a use case name, a summary, the business impact, and governance tags.
>
> **The governance tags are intentional.** Every use case in a regulated industry has compliance implications — I wanted those visible at the discovery stage, not surfaced for the first time during a risk review.
>
> Switch to Finance or Public Sector if you want — the cards animate on switch."

*Scroll to demo.*

---

## [2:20 – 5:15] AI Demo — The centrepiece

*Pause at the three mode cards.*

> "This is the centrepiece. Three demo modes, each representing a different conversation T-Systems has with clients."

*Point at each mode card as you name it.*

> "**Executive Copilot** — strategic AI guidance for leadership. **Talk to Your Data** — governed access to enterprise data assets. **Sovereign AI Advisor** — compliance, residency, and human-in-the-loop governance.
>
> I'll stay on Talk to Your Data — it's the most interesting for a telecom enterprise audience."

*Click the Talk to Your Data mode card. Scroll down slightly to the LiveAnswerPanel.*

> "The scenario chips on the left are the pre-loaded prompts. The input is free — I can type anything, or use the voice input. Let me click a scenario and generate a live answer."

*Click a scenario chip. Hit Generate. While it loads (1–2 seconds):*

> "This is hitting **gpt-4o-mini via the OpenAI API in real time** — not a scripted mock. The status line will confirm that."

*Answer appears. Point at each element as you mention it:*

> "Executive summary types out as the answer arrives — gives me time to narrate. Below that, the core answer in T-Systems voice — 'we recommend', 'for your organisation'.
>
> On the right: **trust cues** — why this answer can be trusted, compliance badges. Source citations with freshness dates — so the client knows the answer is grounded, not generated from thin air. And follow-up chips at the bottom — the three most likely next questions."

*Click "Show trace".*

> "Now — this is the moment for the technical people in the room. When I click 'Show trace', I see the five stages the answer moved through: retrieval, policy checks, orchestration, model gateway, monitoring. **This is the architecture made visible inside the answer** — not in a separate diagram."

*Click "Try prompt injection ↗" chip.*

> "One more thing. Watch what happens when someone tries to attack the system."

*Popup fires. Point at the elements:*

> "The guardrail intercepted it before it reached the model. You can see the exact fragment that triggered the rule, the category — prompt injection — the pipeline trace showing the request terminated at the scan layer. **No data was forwarded.** This is how you demonstrate enterprise-grade trust, not just claim it."

*Click dismiss. Scroll down to the quality monitor.*

> "And below the demo — this is the observability layer. **Groundedness score, hallucination rate, citation coverage.** The hallucination rate shows the trend arrow — down from 3.4% to 1.2%. Underneath that, the six techniques we use to achieve it: retrieval-augmented grounding, confidence gating, continuous eval loop, drift detection, human escalation, prompt hardening.
>
> This section exists because the question every enterprise client asks is: 'How do you know your AI isn't making things up?' Now I have a visual answer."

---

## [5:15 – 6:00] Architecture — The platform behind it

*Scroll to the architecture section.*

> "The architecture section shows the **reference stack for enterprise AI at scale** — nine layers from channels to infrastructure.
>
> I want to highlight two specifically."

*Point at or click the Security layer.*

> "The Security layer — zero-trust networking, secret rotation, threat detection, encryption at rest. Most AI architecture diagrams skip this entirely. In an enterprise with real data and real liability, it belongs in the picture from day one."

*Point at the Governance layer.*

> "And the Governance layer — guardrails, compliance, human approval, redaction. This is where the guardrail we just saw in the demo lives at the platform level. The demo makes it feel real; the architecture makes it feel credible."

---

## [6:00 – 6:35] Governance — Trusted AI by Design

*Scroll to Governance section.*

> "The governance section is for the risk and compliance audience.
>
> Ten controls, split into critical and standard tiers. **EU data residency, auditability, explainability, human review** — these are not decorative. Each card has a status and a description of how the control is enforced.
>
> I made this section feel important, not like a checkbox. In a regulated industry, trust is a product feature."

---

## [6:35 – 7:10] Delivery Journey — The consulting story

*Scroll to Delivery Journey.*

> "Finally, the delivery journey — Strategy, Prototype, Pilot, Production, Scale.
>
> Each stage has what is delivered, the technical maturity, governance maturity, and the business outcome.
>
> **This is the T-Systems sales story in one scroll.** The client is not buying a demo. They are buying a path from where they are today to a governed, scaled AI capability. This section makes that path concrete."

---

## [7:10 – 8:15] How I built it — The honest version

*Scroll back to top slowly while talking.*

> "Let me be transparent about the build for a moment.
>
> **Stack:** React, TypeScript, Tailwind, Framer Motion. A Vite middleware proxies to OpenAI — the whole thing runs from one command, no infra needed. When the API key is configured, answers are live. Without it, the scripted fallback is indistinguishable in a demo.
>
> **What I prioritised:** A coherent narrative over maximum features. I built the sections that matter most in a 10-minute client conversation — not every capability the spec mentioned.
>
> **The data is typed mock data** structured like a real API shape. Swap the JSON files for real API calls and the UI is unchanged. That is an intentional architectural choice — the presentation layer should not care whether the data is mocked or live.
>
> **Two things I would build next with more time:** a real RAG pipeline connecting to actual documents, and a proper multi-tenant auth model for the enterprise persona."

---

## [8:15 – 9:15] What this demonstrates

> "I want to name what I was trying to show with this prototype beyond the code.
>
> First — **I understand the T-Systems proposition.** Sovereign AI, governed deployment, pilot to scale. These are not just words in this app — they are the design constraints.
>
> Second — **I can make complex ideas simple and presentable.** The guardrail demo, the architectural trace, the hallucination metrics — these are hard enterprise AI concepts made tangible in a 10-minute scroll.
>
> Third — **I make decisions under constraint.** Two hours is not a lot of time. Every section I shipped is complete. Nothing is half-finished or placeholder.
>
> The questions I find most interesting are the ones this prototype opens rather than closes."

---

## [9:15 – 10:00] Close — Hand it to them

> "That's the app.
>
> A few threads I'd genuinely enjoy pulling on with you:
>
> How does T-Systems' sovereign AI story compete specifically against Azure's EU Data Boundary — is the architecture actually different or is it positioning?
>
> At what scale does the governance layer become a performance bottleneck, and what does T-Systems do about that?
>
> And how does the mode switch between Executive Copilot and Talk to Your Data map to real infrastructure differences — or is that purely a UX distinction?
>
> I'm happy to go deeper on any of those, or look at the code together if that's useful."

---

## Quick-reference timing

| Section | Clock | Duration |
|---------|-------|----------|
| Opening framing | 0:00 | 30s |
| Hero | 0:30 | 45s |
| Value pillars | 1:15 | 30s |
| Industry use cases | 1:45 | 35s |
| AI demo (full) | 2:20 | 2m 55s |
| Architecture | 5:15 | 45s |
| Governance | 6:00 | 35s |
| Delivery journey | 6:35 | 35s |
| How I built it | 7:10 | 65s |
| What this demonstrates | 8:15 | 60s |
| Close | 9:15 | 45s |
| **Total** | | **10:00** |

---

## If they interrupt early

Stop presenting. Answer the question fully. Then offer:
> "Do you want me to keep going through the rest of the app or would you rather stay here and go deeper?"

The best demo is the one that turns into a conversation at minute four.

---

## Handling likely questions

| Question | One-sentence answer |
|----------|-------------------|
| Is this real AI or mocked? | The demo panel hits gpt-4o-mini live — open the network tab and watch the request fire. Fallback kicks in only if the API is unavailable. |
| How would you scale the retrieval layer? | Vector store per tenant, freshness-gated ingestion, permission checks before retrieval — the architecture layer shows the design. |
| What's the real hallucination rate? | The metrics are representative — the techniques shown (RAG grounding, confidence gating, eval loop) are the actual levers. I can walk through each. |
| Why not use an agent framework? | For a bounded advisory assistant, a retrieval-plus-gateway pattern is more auditable and governable than an open agent loop — important in regulated settings. |
| What would production deployment look like? | The delivery journey section maps it: pilot with one use case and limited users, governance controls before expansion, eval loop before scale. |
