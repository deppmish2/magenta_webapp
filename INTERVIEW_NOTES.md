# Interview Presentation Notes — MagentAI Experience

> Actual words. Read these, internalize them, then speak naturally.
> Each block is one breath. Pause between blocks.

---

## BEFORE YOU BEGIN
App open at http://localhost:5173 · Chrome · mic permission granted · Enterprise mode active

---

## OPENING

"Before I walk you through the app, let me tell you the one decision I made at the start.

The brief said — create a prototype that represents Telekom's values, T-Systems' vision, and demonstrates AI. That could go in a hundred directions.

I decided to build something a senior architect at T-Systems could actually open in front of a client CTO and narrate confidently. Not a proof of concept. Not a hackathon demo. A client-facing product presentation.

That single decision shaped every section you're about to see."

---

## HERO SECTION
*[app is showing the hero — point at the headline and stat cards]*

"The app is called MagentAI Experience. The tagline is 'AI at Scale. Human at Heart.' — and that tension is exactly what T-Systems has to hold. Serious, enterprise-grade AI that still feels human and usable.

There are three entry points — launch the demo, explore use cases, or go straight to the architecture. I'll take you through all of them.

The floating cards on the right — production-grade, EU sovereign, 8 to 12 weeks to pilot — those aren't just labels. They become concrete as we go deeper."

---

## VALUE PILLARS
*[scroll to the four cards — Discover, Build, Govern, Scale]*

"The four pillars frame what T-Systems actually does for a client: Discover, Build, Govern, Scale.

Discover — find the right AI opportunities before spending budget on the wrong ones.
Build — prototype assistants, copilots, and enterprise workflows quickly.
Govern — apply controls, compliance, and oversight from the start, not as an afterthought.
Scale — move from a working pilot to a production platform without losing trust or control.

I chose these over Telekom's brand values in this section deliberately. In a client room the question is what do you do for us — not what do you stand for. The brand values show up in how the experience feels, not in a card grid."

---

## INDUSTRY USE CASES
*[click Telecom tab]*

"The use case explorer covers five industries. I'll stay on Telecom — that's the home ground.

Each card has the use case name, a plain-language summary, the business impact, and governance tags. The governance tags are intentional — every use case in a regulated industry has compliance implications, and I wanted those visible at the discovery stage, not surfaced for the first time during a legal review six months later.

If you want to switch industries, the cards animate on tab change. Finance and Public Sector have the most detailed use cases."

---

## AI DEMO
*[scroll to the three mode cards]*

"This is the centrepiece of the app. Three demo modes, each representing a different conversation T-Systems has with clients.

Executive Copilot — strategic AI guidance for leadership. Things like roadmaps, AI opportunity sizing, business case framing.

Talk to Your Data — governed access to enterprise data assets. Synthesising operational metrics, CRM insights, and knowledge bases into structured answers.

Sovereign AI Advisor — governance-first guidance on deployment readiness, compliance posture, data residency, and human-in-the-loop controls.

I'll use Talk to Your Data — it's the most relevant for a telecom enterprise audience."

*[click Talk to Your Data mode card, scroll to the answer panel]*

"The scenario chips on the left are the pre-loaded prompts. I can also type anything in the free input, or use voice input — the browser picks up the microphone natively.

Let me click a scenario and generate a live answer."

*[click a chip, hit Generate — while it loads say:]*

"This is hitting gpt-4o-mini via the OpenAI API right now — not a scripted response. The status line will confirm that once the answer arrives."

*[answer appears — point at each part:]*

"The executive summary types out as it arrives. That's intentional — it gives me three seconds to say something while the answer appears, and it feels alive without being distracting.

Below that, the core answer written in T-Systems voice — we recommend, for your organisation, T-Systems would approach this by. Not generic AI prose.

On the right — trust cues. Why this answer can be trusted. Specific compliance badges. Source citations with freshness dates and snippets, so the client can see the answer is grounded in real evidence, not generated from nothing.

And at the bottom, follow-up chips — the three most likely next questions. They keep the conversation moving without the client having to think about what to ask next."

*[click "Show trace"]*

"Now — this is for the technical people in the room.

When I click Show trace, I see the five stages the answer moved through — retrieval, policy checks, orchestration, model gateway, monitoring.

This is the architecture made visible inside the answer itself. Not in a separate diagram on a slide — right here, next to the response it produced."

*[click "Try prompt injection ↗" chip at the bottom of the scenario list]*

"Watch what happens when someone tries to attack the system."

*[popup fires]*

"The guardrail intercepted that before it ever reached the model. You can see the exact fragment that triggered the rule, the category — prompt injection — and the pipeline trace showing the request terminated at the scan stage. No data was forwarded to OpenAI. Nothing was generated.

This is how you demonstrate enterprise-grade security in a demo — you don't claim it, you show it firing."

*[dismiss popup, scroll down to quality monitor]*

"Below the demo panel is the observability layer — how we measure and reduce hallucinations.

Groundedness score, hallucination rate with a trend arrow showing it came down from 3.4 to 1.2 percent, citation coverage, confidence score. These shift per mode — switch to Sovereign AI Advisor and you see different operating signals.

Underneath that, six techniques: retrieval-augmented grounding, inline confidence gating, continuous evaluation loop, drift detection, human escalation, and prompt hardening.

The reason this section exists is that every enterprise client asks the same question — how do you know your AI isn't making things up? Now I have a visual answer with concrete numbers behind it."

---

## ARCHITECTURE
*[scroll to architecture section]*

"The architecture section shows the reference stack for enterprise AI at scale — nine layers from the channel surface down to infrastructure.

I want to highlight two specifically.

The Security layer — zero-trust networking, secret rotation, threat detection, encryption at rest. Most AI architecture diagrams I've seen skip this entirely. In an enterprise with sensitive data and real liability, security belongs in the picture from day one, not retrofitted later.

And the Governance layer — guardrails, compliance controls, human approval flows, redaction. This is where the guardrail we just saw in the demo lives at platform level. The demo makes the concept feel real. The architecture makes it feel credible and scalable."

---

## GOVERNANCE SECTION
*[scroll to Trusted AI by Design]*

"The governance section is for the risk and compliance audience.

Ten controls across two tiers. Critical controls — EU data residency, auditability, explainability, human review, role-based access. Standard controls — policy enforcement, observability, fallback handling, model monitoring, secure integration.

EU data residency here is a runtime constraint, not a deployment note. The data does not leave EU infrastructure — that is enforced at the platform layer, not documented in a README.

I made this section feel important because in a regulated industry, trust is not a feature you add at the end. It is the product."

---

## DELIVERY JOURNEY
*[scroll to the journey section]*

"The delivery journey section — Strategy, Prototype, Pilot, Production, Scale.

Each stage shows what gets delivered, where the technical maturity sits, where governance maturity sits, and what the business outcome looks like.

This is the T-Systems consulting story in one scroll. The client is not buying a demo. They are buying a path — from where they are today to a governed, scalable AI capability. This section makes that path concrete enough to commit budget to."

---

## HOW I BUILT IT
*[scroll back to top slowly while talking]*

"A few honest things about how this was built.

Stack — React and TypeScript with Vite, Tailwind for styling, Framer Motion for animation. The whole thing runs from a single pnpm dev command — no backend infrastructure, no database, no deployment needed. A thin Vite middleware proxies the answer requests to OpenAI, so the live demo works out of the box.

The mock data is typed and structured like a real API shape. If you wanted to connect this to a real knowledge base, you swap the JSON files for API calls and the UI is unchanged. That was an intentional architectural decision — the presentation layer should not care whether the data is mocked or live.

What I prioritised was a coherent narrative over maximum features. Every section that's in the app is complete and polished. Nothing is half-built.

If I had more time, I'd build a real RAG pipeline with document ingestion, a multi-tenant auth model for the enterprise persona, and live evaluation metrics pulling from a real eval run rather than representative mock data."

---

## CLOSING
*[pause — look up from the screen]*

"That's the prototype.

What I hope it shows is not just that I can build a frontend — it's that I can think about what to build and why, for a specific audience, under a real constraint.

The questions I'm most interested in are the ones this opens rather than closes.

How does T-Systems' sovereign AI story actually compete against Azure's EU Data Boundary — is the architecture different or is it positioning?

At what scale does the inline governance layer become a performance bottleneck, and what does T-Systems do about it?

And how does the mode distinction between Executive Copilot and Talk to Your Data map to real infrastructure differences — or is that a UX abstraction over the same stack?

Happy to go deeper on any of those, or look at the code if that's useful."

---

## IF THEY ASK ABOUT THE AI

**"Is this real AI or a mock?"**
"It's live. Every time you hit Generate, a POST request goes to OpenAI's Chat Completions API using gpt-4o-mini. You can open the browser network tab and watch it fire. The scripted fallback only kicks in if the API is unreachable — and in a demo setting you can't tell the difference, which is the point."

**"How do you actually reduce hallucinations?"**
"Six techniques. The most important one is retrieval-augmented grounding — the model can only cite sources it was explicitly given, so it can't freely generate facts. On top of that, low-confidence completions are gated before delivery. An automated eval loop runs hourly against a curated test set. Statistical drift detection flags when quality starts slipping. Edge cases escalate to human review. And the system prompt enforces structured output formats that make it structurally harder for the model to hallucinate — it has to fill specific fields, not generate free prose."

**"How would this scale?"**
"The retrieval layer needs a vector store per tenant with freshness-gated ingestion and permission checks before anything reaches the model. The model gateway handles routing by latency, cost, and residency policy with automatic failover. The governance controls are inline — they run at request time so scale doesn't require manual review. The architecture section maps the full stack if you want to go through it layer by layer."

**"Why gpt-4o-mini?"**
"Speed and cost for a demo setting. One to two second response times, fraction of the cost of the larger models. For a production advisory assistant at T-Systems scale, you'd benchmark it against the task — some queries need a larger model, most don't."

**"Why T-Systems specifically over Azure or Google?"**
"The sovereign AI angle is genuinely differentiated. T-Systems can offer EU data residency as a runtime constraint enforced at the infrastructure level — not a contractual commitment that still routes data through US parent systems. They're also a consultancy and operator, not just a cloud vendor. They design the use case, build the platform, govern the rollout, and run it. That full-stack accountability is what regulated clients are actually buying."

---

## QUICK CHEAT SHEET

```
Hero          → "AI at Scale. Human at Heart." + 3 CTAs
Pillars       → Discover · Build · Govern · Scale
Use Cases     → 5 industries · governance tags visible at discovery
Demo          → mode select → generate live → trace → guardrail → quality monitor
Architecture  → 9 layers · highlight Security + Governance
Governance    → 10 controls · 2 tiers · EU residency is runtime, not a note
Journey       → 5 stages · "buying a path, not a demo"
Close         → 3 questions · hand it to them
```
