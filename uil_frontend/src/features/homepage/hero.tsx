import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  FileText,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

const STATS = [
  {
    label: "Staff Members",
    value: "400",
    Icon: FileText,
    gradient: "from-primary to-blue-700",
    stagger: false,
  },
  {
    label: "Industry Partners",
    value: "45",
    Icon: Users,
    gradient: "from-emerald-500 to-teal-600",
    stagger: true,
    accentBorder: "border-l-emerald-500/50",
  },
  {
    label: "Success Rate",
    value: "94%",
    Icon: TrendingUp,
    gradient: "from-amber-500 to-orange-600",
    stagger: false,
    badge: "+12% YoY",
  },
];

const links = [
  {
    href: "/signup",
    Icon: ArrowRight,
    label: "Submit Request",
  },
  { href: "/research", variant: "outline", label: "Explore Research" },
];

export default function Hero() {
  return (
    <section>
      <div className="items-center gap-16 grid grid-cols-1 lg:grid-cols-12 lg:text-left text-center">
        {/* Left Column: Copy & CTA */}
        <div className="space-y-8 lg:col-span-7">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 border border-primary/20 rounded-full font-medium text-primary text-sm">
            <ShieldCheck size={16} />
            <span>Certified University Network</span>
          </div>

          <h1 className="font-bold text-foreground text-5xl lg:text-7xl text-balance leading-[1.1] tracking-tight">
            Bridging Industry and{" "}
            <span className="text-primary animate-gradient">University</span>
          </h1>

          <p className="max-w-2xl text-muted-foreground text-xl leading-relaxed">
            A transparent, centralized ecosystem where industrial challenges
            find academic solutions. Track progress, leverage world-class
            research, and scale innovation.
          </p>

          <div className="flex flex-wrap max-lg:justify-center max-lg:items-center gap-4">
            {links.map(({ href, variant, label, Icon }, idx) => (
              <Link key={idx} href={href}>
                <Button
                  variant={variant as "outline"}
                  size="lg"
                  className="px-8 rounded-2xl h-14 text-lg transition-all"
                >
                  {label}
                  {Icon && <Icon className="ml-2 w-5 h-5" />}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Column: Floating Data Interface */}
        <div className="relative lg:col-span-5 text-left">
          <div className="z-10 relative space-y-6">
            {STATS.map(
              (
                { label, value, Icon, gradient, stagger, accentBorder, badge },
                idx,
              ) => (
                <div
                  key={idx}
                  className={`
              group bg-card/80 shadow-2xl backdrop-blur-xl p-5 md:p-6
              border border-border rounded-3xl transition-all duration-500
              hover:-translate-y-1 hover:bg-card/90
              ${stagger ? "md:ml-12" : "md:mr-12"}
              ${accentBorder ? `border-l-4 ${accentBorder}` : ""}
            `}
                >
                  <div className="flex items-center gap-5">
                    {/* Icon Container */}
                    <div
                      className={`bg-linear-to-br ${gradient} shadow-lg p-3 md:p-4 rounded-2xl text-white`}
                    >
                      <Icon className="w-6 md:w-8 h-6 md:h-8" />
                    </div>

                    {/* Text Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="font-semibold text-[10px] text-muted-foreground md:text-xs uppercase tracking-[0.2em]">
                            {label}
                          </p>
                          <h3 className="font-bold tabular-nums text-foreground text-3xl md:text-4xl">
                            {value}
                          </h3>
                        </div>

                        {/* Optional Badge */}
                        {badge && (
                          <div className="flex justify-center items-center bg-emerald-500/10 mb-1 px-3 py-1 border border-emerald-500/20 rounded-full">
                            <span className="font-bold text-[10px] text-emerald-500 md:text-xs">
                              {badge}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
