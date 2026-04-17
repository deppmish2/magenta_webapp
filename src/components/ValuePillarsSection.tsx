import { motion } from "framer-motion";
import { Compass, FlaskConical, Scale, TrendingUp } from "lucide-react";
import { SectionWrapper } from "./SectionWrapper";
import { Card, CardContent } from "./ui/card";
import { modePanelClasses } from "../data/demoContent";

const PILLARS = [
  {
    icon: Compass,
    title: "Discover",
    description:
      "Identify high-value AI opportunities fast. Assess data readiness, map enterprise workflows, and surface the use cases most likely to deliver measurable business outcomes.",
    accent: "text-magenta-300",
    border: "border-magenta-400/20",
    bg: "bg-magenta-500/10",
  },
  {
    icon: FlaskConical,
    title: "Build",
    description:
      "Prototype assistants, copilots, and enterprise workflows. Move from validated use case to working demonstration in weeks — not months.",
    accent: "text-sky-300",
    border: "border-sky-400/20",
    bg: "bg-sky-500/10",
  },
  {
    icon: Scale,
    title: "Govern",
    description:
      "Apply controls, oversight, compliance, and policy from day one. Governance is not a final checklist — it is a continuous design discipline embedded in every layer.",
    accent: "text-emerald-300",
    border: "border-emerald-400/20",
    bg: "bg-emerald-500/10",
  },
  {
    icon: TrendingUp,
    title: "Scale",
    description:
      "Move from pilot to production with a platform architecture built for multi-use-case rollout, cost discipline, and enterprise resilience.",
    accent: "text-violet-300",
    border: "border-violet-400/20",
    bg: "bg-violet-500/10",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export function ValuePillarsSection() {
  return (
    <SectionWrapper
      id="values"
      eyebrow="Core Capabilities"
      title="From idea to enterprise-grade AI"
      description="Four integrated capabilities that take an organisation from AI opportunity to governed, scalable production deployment."
      tintClassName={modePanelClasses.enterprise}
    >
      <motion.div
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <motion.div key={pillar.title} variants={cardVariants}>
              <Card className="group h-full border-white/10 bg-black/30 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-glow">
                <CardContent className="flex h-full flex-col space-y-4 p-6">
                  <div
                    className={`w-fit rounded-2xl border p-3 ${pillar.border} ${pillar.bg} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className={`h-6 w-6 ${pillar.accent}`} />
                  </div>
                  <p className="font-display text-2xl text-white">{pillar.title}</p>
                  <p className="text-sm leading-7 text-white/60">{pillar.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </SectionWrapper>
  );
}
