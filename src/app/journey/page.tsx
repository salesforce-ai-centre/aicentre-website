import Navigation from '@/components/Navigation';
import ContactBanner from '@/components/ContactBanner';

export const metadata = {
  title: 'AI Centre Journey | AI Centre',
  description: 'Explore the right workshop for each stage of your customer\'s Agentforce journey',
};

const stages = [
  { name: "Agent Deal in Progress", color: "#ef4444", glow: "rgba(239,68,68,0.3)" },
  { name: "Agent SKU Provisioned", color: "#0d9488", glow: "rgba(13,148,136,0.3)" },
  { name: "Agent Created", color: "#16a34a", glow: "rgba(22,163,74,0.3)" },
  { name: "Agent in Production", color: "#8b5cf6", glow: "rgba(139,92,246,0.3)" },
];

interface ProgramSpan {
  start: number;
  end: number;
}

interface Program {
  name: string;
  description: string;
  experience: string;
  spans: ProgramSpan[];
  gradient: string;
  glowColor: string;
  audience: 'Business' | 'Team' | 'Technical';
}

const programs: Program[] = [
  {
    name: "Ideation",
    description: "Perfect for customers looking for inspiration on how agents can enhance their day-to-day. Sparks creative thinking around Agentforce use cases tailored to your customer's challenges.",
    experience: "F1 Simulators",
    spans: [{ start: 1, end: 1 }, { start: 4, end: 4 }],
    gradient: "linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)",
    glowColor: "rgba(56,189,248,0.25)",
    audience: "Business",
  },
  {
    name: "Agent Challenge",
    description: "Perfect for cross-functional teams to align on potential Agentforce solutions and anchor it in human centred design. Teams collaborate to identify, design, and pitch agent-powered solutions.",
    experience: "F1 Simulators",
    spans: [{ start: 1, end: 2 }],
    gradient: "linear-gradient(135deg, #1e1b4b 0%, #3730a3 100%)",
    glowColor: "rgba(55,48,163,0.3)",
    audience: "Team",
  },
  {
    name: "Prompt Builder",
    description: "Perfect for technical teams who want to master prompt grounding to create powerful actions for agents. A hands-on deep dive into building effective prompts that drive reliable agent behaviour.",
    experience: "Turing Test",
    spans: [{ start: 1, end: 3 }],
    gradient: "linear-gradient(135deg, #f97316 0%, #ef4444 100%)",
    glowColor: "rgba(249,115,22,0.25)",
    audience: "Technical",
  },
  {
    name: "Agentforce Hands-on",
    description: "Perfect for technical teams who want to experiment boldly with Agentforce outside of their formal environments with guidance from Salesforce solutions teams. Build real agents in a supported sandbox.",
    experience: "F1 Simulators",
    spans: [{ start: 1, end: 3 }],
    gradient: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
    glowColor: "rgba(251,146,60,0.25)",
    audience: "Technical",
  },
  {
    name: "Data & Agentforce Now",
    description: "Perfect for technical teams early on in their Agentforce journey requiring a thorough guided approach to building across Data 360 and Agentforce products.",
    experience: "Turing Test",
    spans: [{ start: 1, end: 2 }],
    gradient: "linear-gradient(135deg, #ea580c 0%, #dc2626 100%)",
    glowColor: "rgba(234,88,12,0.25)",
    audience: "Technical",
  },
];

const audienceLegend = [
  { label: "Business", color: "#38bdf8" },
  { label: "Team", color: "#6366f1" },
  { label: "Technical", color: "#f97316" },
];

export default function JourneyPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-6 section-padding">
        <div className="container-max">
          <h1 className="text-4xl md:text-5xl font-black mb-3 text-white tracking-tight">
            AI Centre Journey
          </h1>
          <p className="text-white/60 text-base md:text-lg max-w-xl">
            Map the right programme to each stage of your customer&apos;s Agentforce journey. Hover over a programme to see details.
          </p>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-6 section-padding">
        <div className="container-max">
          {/* Stage Header Ribbon - separate from the chart so no overflow issues */}
          <div className="relative rounded-t-2xl overflow-hidden border border-b-0 border-white/20 bg-white/10">
            <div className="grid grid-cols-4">
              {stages.map((stage) => (
                <div
                  key={stage.name}
                  className="relative px-3 md:px-4 py-5 text-center"
                  style={{
                    background: `linear-gradient(180deg, ${stage.color}22 0%, transparent 100%)`,
                    borderBottom: `2px solid ${stage.color}66`,
                  }}
                >
                  {/* Stage node dot */}
                  <div
                    className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full z-10"
                    style={{
                      background: stage.color,
                      boxShadow: `0 0 8px ${stage.glow}, 0 0 20px ${stage.glow}`,
                    }}
                  />
                  <span className="text-white font-bold text-[10px] sm:text-xs md:text-sm tracking-wide uppercase">
                    {stage.name}
                  </span>
                </div>
              ))}
            </div>
            {/* Connecting gradient line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(to right, ${stages[0].color}, ${stages[1].color}, ${stages[2].color}, ${stages[3].color})`,
                transform: 'translateY(1px)',
              }}
            />
          </div>

          {/* Gantt Chart Area - no overflow clipping so tooltips can escape */}
          <div className="relative border border-t-0 border-white/20 bg-white/10 rounded-b-2xl px-2 sm:px-3 md:px-5 pt-8 pb-8">
            {/* Vertical column dividers */}
            <div className="absolute inset-0 grid grid-cols-4 pointer-events-none" aria-hidden="true">
              {stages.map((_, i) => (
                <div key={i} className={i > 0 ? 'border-l border-white/[0.04]' : ''} />
              ))}
            </div>

            {/* Programme Rows */}
            <div className="relative space-y-2.5">
              {programs.map((program, programIndex) => {
                const isLastTwo = programIndex >= programs.length - 2;
                return (
                  <div
                    key={program.name}
                    className="grid grid-cols-4 items-center"
                    style={{ minHeight: '50px' }}
                  >
                    {program.spans.map((span, i) => (
                      <div
                        key={i}
                        className="group relative mx-0.5 sm:mx-1"
                        style={{
                          gridColumn: `${span.start} / ${span.end + 1}`,
                          gridRow: 1,
                        }}
                      >
                        {/* Hover glow */}
                        <div
                          className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          style={{
                            background: program.glowColor,
                            filter: 'blur(12px)',
                          }}
                        />

                        {/* Bar */}
                        <div
                          className="relative rounded-xl px-2 sm:px-4 py-3 flex items-center justify-center border border-white/[0.08] group-hover:border-white/20 transition-all duration-200 cursor-default"
                          style={{
                            background: program.gradient,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                          }}
                        >
                          <span className="text-white font-semibold text-xs sm:text-sm truncate">
                            {program.name}
                          </span>
                        </div>

                        {/* Hover Tooltip - positioned above for bottom rows, below for top rows */}
                        <div
                          className={`invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 absolute left-0 z-50 rounded-xl p-5 border border-white/15 shadow-2xl pointer-events-none ${
                            isLastTwo ? 'bottom-full mb-3' : 'top-full mt-3'
                          }`}
                          style={{
                            minWidth: '300px',
                            maxWidth: '380px',
                            background: 'linear-gradient(135deg, rgba(15,15,35,0.97) 0%, rgba(30,20,60,0.97) 100%)',
                          }}
                        >
                          {/* Accent bar */}
                          <div
                            className={`absolute left-4 right-4 h-[2px] rounded-full ${isLastTwo ? 'bottom-0' : 'top-0'}`}
                            style={{ background: program.gradient }}
                          />

                          <h4 className="text-white font-bold text-base mb-2 mt-1">{program.name}</h4>
                          <p className="text-white/70 text-sm leading-relaxed mb-4">{program.description}</p>

                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-purple-300 text-xs font-medium bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/20">
                              Recommended: {program.experience}
                            </span>
                            <span
                              className="text-xs font-medium px-3 py-1 rounded-full border"
                              style={{
                                color: audienceLegend.find(a => a.label === program.audience)?.color,
                                borderColor: `${audienceLegend.find(a => a.label === program.audience)?.color}33`,
                                background: `${audienceLegend.find(a => a.label === program.audience)?.color}15`,
                              }}
                            >
                              {program.audience}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-5 mt-5 px-1">
            <span className="text-white/30 text-xs font-bold uppercase tracking-[0.15em]">Audience</span>
            {audienceLegend.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: item.color, boxShadow: `0 0 6px ${item.color}44` }}
                />
                <span className="text-white/50 text-xs font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactBanner />
    </main>
  );
}
