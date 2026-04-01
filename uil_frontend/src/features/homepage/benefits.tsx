import { Building2, CheckCircle2, GraduationCap } from "lucide-react";

const INDUSTRY_PERKS = [
  "Access cutting-edge innovation",
  "Solve complex technical challenges",
  "Transparent project tracking",
  "Cost-effective R&D solutions",
  "Long-term academic partnerships",
];

const UNIVERSITY_PERKS = [
  "Streamlined collaboration management",
  "Real-world research application",
  "Diverse funding opportunities",
  "Enhanced project visibility",
  "Professional industry engagement",
];

export default function Benefits() {
  return (
    <section>
      <div className="mb-20 text-center">
        <h2 className="mb-6 font-bold text-foreground text-4xl md:text-5xl">
          Designed for <span className="text-primary">Impact</span>
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
          A dual-sided ecosystem built to empower both industry innovators and
          academic pioneers.
        </p>
      </div>

      <div className="relative gap-12 lg:gap-0 grid grid-cols-1 lg:grid-cols-2">
        {/* Vertical Divider (Desktop Only) */}
        <div className="hidden lg:block top-10 bottom-10 left-1/2 absolute bg-border w-px -translate-x-1/2" />

        {/* Industry Side */}
        <div className="group lg:pr-16">
          <div className="flex items-center gap-5 mb-10">
            <div className="bg-primary/10 group-hover:bg-primary p-4 rounded-2xl group-hover:text-white transition-all duration-500">
              <Building2
                size={32}
                className="text-primary group-hover:text-white"
              />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-3xl">
                For Industries
              </h3>
              <p className="font-medium text-primary text-sm">
                Scale your technical capabilities
              </p>
            </div>
          </div>

          <div className="gap-4 grid">
            {INDUSTRY_PERKS.map((perk, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-background p-4 border border-border hover:border-primary/50 rounded-2xl transition-all hover:translate-x-2"
              >
                <div className="bg-primary/10 p-1 rounded-full">
                  <CheckCircle2 size={18} className="text-primary" />
                </div>
                <span className="font-medium text-muted-foreground">
                  {perk}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-linear-to-br from-primary/5 to-transparent mt-8 p-6 border border-primary/10 rounded-3xl text-muted-foreground text-sm italic">
            &quot;We transformed our R&D pipeline by connecting directly with
            university labs through this platform.&quot;
          </div>
        </div>

        {/* University Side */}
        <div className="group mt-12 lg:mt-0 lg:pl-16">
          <div className="flex items-center gap-5 mb-10">
            <div className="bg-emerald-500/10 group-hover:bg-emerald-500 p-4 rounded-2xl group-hover:text-white transition-all duration-500">
              <GraduationCap
                size={32}
                className="text-emerald-500 group-hover:text-white"
              />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-3xl">
                For University
              </h3>
              <p className="font-medium text-emerald-500 text-sm">
                Translate research into reality
              </p>
            </div>
          </div>

          <div className="gap-4 grid">
            {UNIVERSITY_PERKS.map((perk, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-background p-4 border border-border hover:border-emerald-500/50 rounded-2xl transition-all hover:-translate-x-2"
              >
                <div className="bg-emerald-500/10 p-1 rounded-full">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                </div>
                <span className="font-medium text-muted-foreground">
                  {perk}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-linear-to-br from-emerald-500/5 to-transparent mt-8 p-6 border border-emerald-500/10 rounded-3xl text-muted-foreground text-sm italic">
            &quot;This platform removes the administrative hurdles of industry
            engagement, letting us focus on the science.&quot;
          </div>
        </div>
      </div>
    </section>
  );
}
