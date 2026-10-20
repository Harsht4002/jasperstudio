import { RevealSection } from "../scroll-reveal";

interface ValueProp {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const valueProps: ValueProp[] = [
  {
    title: "Handcrafted by Indian artisans",
    description: "Honoring traditional craft techniques and generational mastery from artisan communities across India.",
    icon: (
      <svg className="size-6 text-[#D5952B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    )
  },
  {
    title: "Small batches, never mass-produced",
    description: "Created in limited quantities with mindful intention, patient hands, and distinctive individual character.",
    icon: (
      <svg className="size-6 text-[#D5952B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
      </svg>
    )
  },
  {
    title: "Rooted in heritage, made for modern living",
    description: "Centuries-old Indian craft idioms reimagined for refined contemporary everyday rituals and homes.",
    icon: (
      <svg className="size-6 text-[#D5952B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.333A2.25 2.25 0 0018.75 8.25H5.25a2.25 2.25 0 00-2.25 2.083V21" />
      </svg>
    )
  },
  {
    title: "Thoughtfully packaged, ready to gift",
    description: "Wrapped with sustainable, artisanal presentation—ideal for personal keepsakes and celebratory gifts.",
    icon: (
      <svg className="size-6 text-[#D5952B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H4.5a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    )
  }
];

export function ValueProps() {
  return (
    <RevealSection className="mx-auto my-[60px] md:my-[90px] w-[calc(100%-2rem)] max-w-[1360px] sm:w-[calc(100%-60px)]">
      <div 
        className="rounded-[24px] bg-[#FAF8F5] p-6 sm:p-10 md:p-12 shadow-soft border border-[#243C27]/10"
        aria-label="Studio Values and Trust"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {valueProps.map((prop, idx) => (
            <div
              key={idx}
              className="flex flex-col items-start p-5 sm:p-6 rounded-[20px] bg-[#F4EEE0]/60 border border-[#243C27]/5 hover:bg-[#F4EEE0] transition-all duration-300 group"
            >
              <div className="size-12 rounded-full bg-[#243C27]/5 border border-[#D5952B]/40 flex items-center justify-center mb-4 group-hover:bg-[#243C27] group-hover:text-[#F4EEE0] transition-colors">
                {prop.icon}
              </div>
              <h3 className="font-display text-lg font-semibold text-[#243C27] leading-snug mb-2 group-hover:text-[#6B1E28] transition-colors">
                {prop.title}
              </h3>
              <p className="font-body text-xs text-[#243C27]/75 leading-relaxed">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}
