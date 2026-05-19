import Benefits from "@/features/public/homepage/benefits";
import CTA from "@/features/public/homepage/cta";
import FeaturedContent from "@/features/public/homepage/featured-content";
import Features from "@/features/public/homepage/features";
import HowItWorks from "@/features/public/homepage/how-it-works";
import Hero from "@/features/public/homepage/hero";

const HomePage = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-24 lg:gap-48">
      <Hero />
      <HowItWorks />
      <FeaturedContent />
      <Features />
      <Benefits />
      <CTA />
    </div>
  );
};

export default HomePage;
