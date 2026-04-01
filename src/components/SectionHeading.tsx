interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-3xl space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-magenta-200/75">
        {eyebrow}
      </p>
      <div className="space-y-3">
        <h2 className="font-display text-3xl text-white sm:text-4xl">{title}</h2>
        <p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
          {description}
        </p>
      </div>
    </div>
  );
}
