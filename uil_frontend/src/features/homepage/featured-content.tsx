"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const CATEGORIES = ["All", "Active Project", "Research Call", "Success Story"];

const FEATURED_ITEMS = [
  {
    category: "Active Project",
    title: "AI-Powered Quality Control",
    desc: "Developing machine learning algorithms for automated defect detection in high-precision manufacturing systems.",
    sector: "Manufacturing & Engineering",
    accent: "text-blue-500 bg-blue-500/10",
    shadow: "group-hover:shadow-blue-500/10",
  },
  {
    category: "Research Call",
    title: "Sustainable Energy Solutions",
    desc: "Open call for research partnerships in renewable energy storage and grid optimization technologies.",
    sector: "Energy & Environment",
    accent: "text-emerald-500 bg-emerald-500/10",
    shadow: "group-hover:shadow-emerald-500/10",
  },
  {
    category: "Success Story",
    title: "Smart City Infrastructure",
    desc: "A collaboration resulting in IoT-based traffic management systems currently deployed across 5 major cities.",
    sector: "Technology & Urban Planning",
    accent: "text-amber-500 bg-amber-500/10",
    shadow: "group-hover:shadow-amber-500/10",
  },
];

export default function FeaturedContent() {
  const [activeTab, setActiveTab] = useState(CATEGORIES[0]);

  const filteredItems =
    activeTab === "All"
      ? FEATURED_ITEMS
      : FEATURED_ITEMS.filter((item) => item.category === activeTab);

  return (
    <section>
      {/* Section Header */}
      <div className="mb-12 text-center">
        <h2 className="mb-4 font-bold text-foreground text-4xl md:text-5xl tracking-tight">
          Featured <span className="text-primary">Innovation</span>
        </h2>
        <p className="mx-auto max-w-xl text-muted-foreground text-lg leading-relaxed">
          Explore the latest milestones and active research emerging from our
          collaborative academic and industrial network.
        </p>
      </div>

      {/* Tab Filter - Professional Segmented Control */}
      <ResponsiveTabs activeTab={activeTab} onActiveTab={setActiveTab} />

      {/* Grid - Animated transition when filtering */}
      <div className="gap-8 grid grid-cols-1 lg:grid-cols-3 transition-all duration-500">
        {filteredItems.map((item, idx) => (
          <div
            key={idx}
            className="group slide-in-from-bottom-4 relative flex flex-col fill-mode-both h-full animate-in duration-500 fade-in"
          >
            <div
              className={`flex flex-col h-full p-8 rounded-3xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-border/80 shadow-sm ${item.shadow}`}
            >
              <div className="mb-6">
                <span
                  className={`inline-flex items-center justify-center rounded-xl px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${item.accent}`}
                >
                  {item.category}
                </span>
              </div>

              <div className="grow">
                <h3 className="mb-4 font-bold text-foreground group-hover:text-primary text-2xl leading-tight transition-colors">
                  {item.title}
                </h3>
                <p className="mb-8 text-muted-foreground text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="flex justify-between items-center pt-6 border-border border-t">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                    Sector
                  </span>
                  <span className="font-semibold text-foreground text-sm">
                    {item.sector}
                  </span>
                </div>

                <button className="flex justify-center items-center group-hover:bg-primary border border-border group-hover:border-primary rounded-full w-10 h-10 group-hover:text-white transition-all duration-300">
                  <ArrowUpRight size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 text-center">
        <button className="group inline-flex items-center gap-2 font-bold text-foreground hover:text-primary text-sm uppercase tracking-[0.15em] transition-colors">
          View all projects
          <div className="bg-primary w-8 group-hover:w-12 h-0.5 transition-all duration-300" />
        </button>
      </div>
    </section>
  );
}

function ResponsiveTabs({
  activeTab,
  onActiveTab,
}: {
  activeTab: string;
  onActiveTab: (tab: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex justify-center mb-8">
      {/* --- MOBILE VIEW: Dropdown --- */}
      <div className="lg:hidden relative w-full max-w-xs">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex justify-between items-center bg-card/50 shadow-sm backdrop-blur-md px-6 py-4 border border-border rounded-2xl w-full active:scale-[0.98] transition-all"
        >
          <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
            Category: <span className="text-foreground">{activeTab}</span>
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="top-full right-0 left-0 z-50 absolute bg-card shadow-xl mt-2 border border-border rounded-2xl overflow-hidden animate-in duration-200 fade-in zoom-in-95">
            {CATEGORIES.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  onActiveTab(tab);
                  setIsOpen(false);
                }}
                className={`w-full px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest transition-colors
                  ${activeTab === tab ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"}
                `}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* --- DESKTOP VIEW: Original Pill --- */}
      <div className="hidden lg:inline-flex bg-card/50 shadow-inner backdrop-blur-md p-1 border border-border rounded-full">
        {CATEGORIES.map((tab) => (
          <button
            key={tab}
            onClick={() => onActiveTab(tab)}
            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
              activeTab === tab
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
