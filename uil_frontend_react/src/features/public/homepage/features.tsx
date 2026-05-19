import {
  Eye,
  Target,
  GraduationCap,
  BarChart3,
  Lightbulb,
  CheckCircle,
} from "lucide-react";

const FEATURES = [
  {
    title: "Transparent Request Tracking",
    desc: "Monitor your requests in real-time with detailed status updates and milestone tracking.",
    icon: Eye,
  },
  {
    title: "Centralized Coordination",
    desc: "Single point of contact for all university-industry interactions.",
    icon: Target,
  },
  {
    title: "University Expertise",
    desc: "Connect with leading researchers and faculty across all disciplines.",
    icon: GraduationCap,
  },
  {
    title: "KPI Performance",
    desc: "Measure success with clear metrics and performance indicators for every project.",
    icon: BarChart3,
  },
  {
    title: "Research Visibility",
    desc: "Explore ongoing research initiatives and discover collaboration opportunities.",
    icon: Lightbulb,
  },
  {
    title: "Quality Assurance",
    desc: "Rigorous review processes ensure high-quality industry-standard deliverables.",
    icon: CheckCircle,
  },
];

export default function Features() {
  return (
    <section>
      {/* Section Header */}
      <div className="mb-12 text-center">
        <h2 className="mb-4 font-bold text-foreground text-4xl md:text-5xl tracking-tight">
          Platform <span className="text-primary">Features</span>
        </h2>
        <p className="mx-auto max-w-xl text-muted-foreground text-lg leading-relaxed">
          Everything you need for successful university-industry collaboration,
          centralized in one ecosystem.
        </p>
      </div>

      {/* Grid */}
      <div className="gap-px grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 bg-border border border-border rounded-2xl overflow-hidden">
        {FEATURES.map((feature, idx) => (
          <div
            key={idx}
            className="group bg-card hover:bg-muted/40 p-6 transition-colors duration-200"
          >
            <feature.icon
              size={22}
              className="mb-4 text-primary"
              strokeWidth={1.75}
            />
            <h3 className="mb-1.5 font-semibold text-foreground text-base">
              {feature.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
