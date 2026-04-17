import { motion } from "framer-motion";
import { SectionWrapper } from "./SectionWrapper";
import { ArchitectureLayerExplorer } from "./ArchitectureLayerExplorer";
import { modePanelClasses } from "../data/demoContent";
import type { DemoMode } from "../types";

interface ArchitectureSectionProps {
  mode: DemoMode;
  promptId: string;
}

export function ArchitectureSection({ mode, promptId }: ArchitectureSectionProps) {
  return (
    <SectionWrapper
      id="architecture"
      eyebrow="Reference Architecture"
      title="Enterprise AI at Scale"
      description="A layered platform architecture designed for governed deployment — from user-facing channels through to sovereign infrastructure. Click any layer to explore its role and controls."
      tintClassName={modePanelClasses[mode]}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
      >
        <ArchitectureLayerExplorer mode={mode} promptId={promptId} />
      </motion.div>
    </SectionWrapper>
  );
}
