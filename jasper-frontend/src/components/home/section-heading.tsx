export function SectionHeading({
  eyebrow,
  title
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="text-[#243C27]">
      <p className="mb-2 font-body text-xs font-medium uppercase tracking-[0.25em] text-[#D5952B]">{eyebrow}</p>
      <h2 className="font-display font-normal text-3xl sm:text-4xl md:text-5xl text-[#243C27] tracking-tight">
        {title}
      </h2>
    </div>
  );
}
