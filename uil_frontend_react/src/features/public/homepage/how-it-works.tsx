import { Award, ClipboardCheck, Send, Settings } from "lucide-react";

const STEPS = [
  {
    title: "Submit Request",
    desc: "Industry partners submit technical needs through our secure platform. Our form captures every detail for precision matching.",
    icon: Send,
    color: "from-blue-600 to-indigo-700",
    shadow: "group-hover:shadow-blue-500/20",
    accent: "text-blue-500 bg-blue-500/10",
  },
  {
    title: "Review & Assign",
    desc: "Our linkage office strategically connects you with the right university experts based on expertise and project requirements.",
    icon: ClipboardCheck,
    color: "from-emerald-500 to-teal-600",
    shadow: "group-hover:shadow-emerald-500/20",
    accent: "text-emerald-500 bg-emerald-500/10",
  },
  {
    title: "Track Progress",
    desc: "Collaborate seamlessly while tracking milestones through our transparent dashboard with real-time stakeholder updates.",
    icon: Settings,
    color: "from-amber-500 to-orange-600",
    shadow: "group-hover:shadow-amber-500/20",
    accent: "text-amber-500 bg-amber-500/10",
  },
  {
    title: "Deliver & Evaluate",
    desc: "Receive quality deliverables meeting industry standards. Provide feedback to build lasting academic partnerships.",
    icon: Award,
    color: "from-violet-500 to-purple-600",
    shadow: "group-hover:shadow-violet-500/20",
    accent: "text-violet-500 bg-violet-500/10",
  },
];

export default function HowItWorks() {
  return (
    <section>
      <div className="mb-16 lg:mb-24 text-center">
        <h2 className="mb-4 font-bold text-foreground text-3xl lg:text-5xl tracking-tight">
          Our Collaboration <span className="text-primary">Process</span>
        </h2>
        <p className="mx-auto max-w-xl text-muted-foreground text-base lg:text-lg">
          A streamlined bridge between industrial challenges and academic
          excellence.
        </p>
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Lines Logic */}
        {/* Desktop Horizontal Line */}
        <div className="hidden lg:block top-1/2 right-0 left-0 absolute bg-border h-px -translate-y-1/2" />

        {/* Mobile Vertical Line */}
        <div className="lg:hidden top-0 bottom-0 left-6 absolute ml-[-0.5px] bg-border w-px" />

        <div className="gap-8 lg:gap-4 grid grid-cols-1 lg:grid-cols-4">
          {STEPS.map((step, idx) => {
            const isEven = idx % 2 === 1;

            return (
              <div
                key={idx}
                className="relative flex flex-row lg:flex-col items-start lg:items-center"
              >
                {/* Desktop "Zig-Zag" Content Logic */}
                <div
                  className={`hidden lg:block group w-full transition-all duration-500 ${
                    isEven
                      ? "lg:order-last lg:pt-12"
                      : "lg:order-first lg:pb-12"
                  }`}
                >
                  <StepCard step={step} idx={idx} />
                </div>

                {/* Mobile Content (Always right of the line) */}
                <div className="lg:hidden flex-1 pb-10 pl-12">
                  <StepCard step={step} idx={idx} />
                </div>

                {/* Center Icon Node */}
                <div className="left-0 lg:left-auto z-20 absolute lg:relative flex justify-center items-center w-12 h-12">
                  <div
                    className={`flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-linear-to-br ${step.color} text-white shadow-lg ring-4 ring-background transition-transform duration-500 hover:scale-110`}
                  >
                    <step.icon size={18} className="lg:w-5 lg:h-5" />
                  </div>
                </div>

                {/* Desktop Spacer */}
                <div className="hidden lg:block w-px h-12" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StepCard({
  step,
  idx,
}: {
  step: { shadow: string; accent: string; title: string; desc: string };
  idx: number;
}) {
  return (
    <div
      className={`relative p-5 lg:p-6 rounded-2xl lg:rounded-3xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 lg:hover:-translate-y-2 hover:border-border/80 shadow-sm ${step.shadow}`}
    >
      <div
        className={`inline-flex items-center justify-center rounded-xl px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-3 lg:mb-4 ${step.accent}`}
      >
        Phase 0{idx + 1}
      </div>
      <h3 className="mb-2 font-bold text-foreground text-lg lg:text-xl">
        {step.title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {step.desc}
      </p>
    </div>
  );
}
