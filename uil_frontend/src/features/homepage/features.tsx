import {
  Eye,
  Target,
  GraduationCap,
  BarChart3,
  Lightbulb,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react";

const FEATURES = [
  {
    title: "Transparent Request Tracking",
    desc: "Monitor your requests in real-time with detailed status updates and milestone tracking.",
    icon: Eye,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    className: "lg:col-span-2",
  },
  {
    title: "Centralized Coordination",
    desc: "Single point of contact for all university-industry interactions.",
    icon: Target,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    className: "lg:col-span-1",
  },
  {
    title: "University Expertise",
    desc: "Connect with leading researchers and faculty across all disciplines.",
    icon: GraduationCap,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    className: "lg:col-span-1",
  },
  {
    title: "KPI Performance",
    desc: "Measure success with clear metrics and performance indicators for every project.",
    icon: BarChart3,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    className: "lg:col-span-2",
  },
  {
    title: "Research Visibility",
    desc: "Explore ongoing research initiatives and discover collaboration opportunities.",
    icon: Lightbulb,
    color: "text-primary",
    bg: "bg-primary/10",
    className: "lg:col-span-2",
  },
  {
    title: "Quality Assurance",
    desc: "Rigorous review processes ensure high-quality industry-standard deliverables.",
    icon: CheckCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    className: "lg:col-span-1",
  },
];

export default function Features() {
  return (
    <section>
      {/* Section Header */}
      <div className="flex lg:flex-row flex-col justify-between lg:items-end gap-6 mb-16">
        <div className="max-w-2xl lg:text-left text-center">
          <h2 className="mb-4 font-bold text-foreground text-4xl lg:text-5xl tracking-tight">
            Platform <span className="text-primary">Features</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need for successful university-industry
            collaboration, centralized in one powerful ecosystem.
          </p>
        </div>
        <div className="hidden lg:block">
          <div className="bg-card px-4 py-2 border border-border rounded-full font-medium text-sm">
            6 Core Modules
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
        {FEATURES.map((feature, idx) => (
          <div
            key={idx}
            className={`group relative overflow-hidden bg-card border border-border rounded-3xl p-8 transition-all duration-500 hover:border-primary/30  ${feature.className}`}
          >
            <div className="z-10 relative flex flex-col h-full">
              <div
                className={`mb-6 p-3 rounded-2xl w-fit ${feature.bg} ${feature.color} ring-1 ring-inset ring-current/20`}
              >
                <feature.icon size={28} />
              </div>

              <div className="flex-1">
                <h3 className="mb-3 font-bold text-foreground group-hover:text-primary text-2xl transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-balance leading-relaxed">
                  {feature.desc}
                </p>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 mt-8 font-bold text-primary text-sm transition-all -translate-x-2 group-hover:translate-x-0 duration-300">
                Learn more <ArrowUpRight size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
