import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { industries } from "../data/industries";
import { modePanelClasses } from "../data/demoContent";
import { SectionWrapper } from "./SectionWrapper";
import { Card, CardContent } from "./ui/card";
import { cn } from "../lib/utils";

export function IndustryUseCaseExplorer() {
  const [activeId, setActiveId] = useState(industries[0].id);
  const activeIndustry = industries.find((i) => i.id === activeId) ?? industries[0];

  return (
    <SectionWrapper
      id="use-cases"
      eyebrow="Industry Use Cases"
      title="AI that speaks your industry's language"
      description="Explore validated enterprise AI use cases across five sectors — each with real business impact and embedded governance."
      tintClassName={modePanelClasses.enterprise}
    >
      {/* Tab bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap gap-2"
      >
        {industries.map((industry) => {
          const active = industry.id === activeId;
          return (
            <button
              key={industry.id}
              type="button"
              onClick={() => setActiveId(industry.id)}
              className={cn(
                "rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-250",
                active
                  ? "border-magenta-400/40 bg-magenta-500/20 text-magenta-100 shadow-glow"
                  : "border-white/10 bg-white/[0.04] text-white/55 hover:border-white/20 hover:text-white/85",
              )}
            >
              {industry.label}
            </button>
          );
        })}
      </motion.div>

      {/* Industry description */}
      <AnimatePresence mode="wait">
        <motion.p
          key={`desc-${activeIndustry.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="text-base leading-7 text-white/55"
        >
          {activeIndustry.description}
        </motion.p>
      </AnimatePresence>

      {/* Use case cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndustry.id}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {activeIndustry.useCases.map((uc, index) => (
            <motion.div
              key={uc.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.06 }}
            >
              <Card className="group h-full border-white/10 bg-black/30 transition-all duration-300 hover:border-white/18 hover:bg-white/[0.05]">
                <CardContent className="flex h-full flex-col space-y-4 p-5">
                  <div className="space-y-1">
                    <p className="font-display text-lg text-white leading-tight">{uc.name}</p>
                  </div>

                  <p className="flex-1 text-sm leading-6 text-white/60">{uc.summary}</p>

                  {/* Business impact */}
                  <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/38">
                      Business Impact
                    </p>
                    <p className="mt-1.5 text-sm leading-6 text-white/72">{uc.businessImpact}</p>
                  </div>

                  {/* Governance tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {uc.governanceTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-magenta-400/20 bg-magenta-500/10 px-3 py-1 text-[11px] font-medium text-magenta-200/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </SectionWrapper>
  );
}
