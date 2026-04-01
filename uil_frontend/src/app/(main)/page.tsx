import Benefits from "@/features/homepage/benefits";
import CTA from "@/features/homepage/cta";
import FeaturedContent from "@/features/homepage/featured-content";
import Features from "@/features/homepage/features";
import Hero from "@/features/homepage/hero";
import HowItWorks from "@/features/homepage/how-it-works";

export default async function Home() {
  return (
    <div className="flex flex-col justify-center items-center gap-24 lg:gap-48">
      <Hero />
      <HowItWorks />
      <Features />
      <Benefits />
      <FeaturedContent />
      <CTA />
    </div>
  );
}
