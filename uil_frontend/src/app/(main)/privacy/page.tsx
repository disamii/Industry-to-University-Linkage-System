import React from "react";

const PRIVACY_POINTS = [
  {
    title: "Information Collection",
    desc: "We collect information you provide directly to us, such as when you create an account, submit a request, or communicate with us.",
  },
  {
    title: "Data Usage",
    desc: "We use the information we collect to provide, maintain, and improve our services, develop new features, and protect the platform and our users.",
  },
  {
    title: "Security Measures",
    desc: "We implement industry-standard security measures, including encryption and secure socket layer (SSL) technology, to protect your personal information.",
  },
  {
    title: "Cookie Policy",
    desc: "Our platform uses cookies to enhance user experience, analyze site usage, and assist in our marketing efforts. You can control cookie settings in your browser.",
  },
];

export default function PrivacyPage() {
  return (
    <section>
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-16 pb-12 border-border border-b">
          <h1 className="mb-4 font-bold text-foreground text-4xl md:text-5xl tracking-tight">
            Privacy <span className="text-primary">Policy</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            How we handle and protect your data.
          </p>
        </div>

        {/* Structured Grid of Points */}
        <div className="gap-10 grid grid-cols-1">
          {PRIVACY_POINTS.map((point, idx) => (
            <div key={idx} className="relative">
              <h3 className="mb-3 font-bold text-foreground text-2xl tracking-tight">
                {point.title}
              </h3>
              <p className="max-w-2xl text-muted-foreground leading-relaxed">
                {point.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-12 border-border border-t">
          <h3 className="mb-4 font-bold text-foreground text-lg">
            Third-Party Disclosure
          </h3>
          <p className="mb-8 text-muted-foreground text-sm leading-relaxed">
            We do not sell, trade, or otherwise transfer to outside parties your
            personally identifiable information unless we provide users with
            advance notice. This does not include website hosting partners and
            other parties who assist us in operating our website, so long as
            those parties agree to keep this information confidential.
          </p>

          <button className="bg-foreground hover:bg-primary px-8 py-3 rounded-full font-bold text-background text-sm uppercase tracking-widest transition-colors">
            Download PDF Version
          </button>
        </div>
      </div>
    </section>
  );
}
