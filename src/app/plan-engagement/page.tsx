import Navigation from '@/components/Navigation';
import ContactBanner from '@/components/ContactBanner';
import Timeline from '@/components/Timeline';
import EngagementTiers from '@/components/EngagementTiers';
import { MessageSquare, Clock, Users, Target, ExternalLink, FileText } from 'lucide-react';

export const metadata = {
  title: 'Plan Customer Engagement | AI Centre',
  description: 'Your streamlined guide to planning successful AI Centre customer engagements',
};

export default function PlanEngagementPage() {
  const steps = [
    {
      number: 1,
      title: "Log a REWS Ticket",
      description: "Secure a space in the AI Centre. This is required before any other step.",
      href: "https://rews.my.site.com/REWS/requestform",
      actionLabel: "Open REWS Form",
      required: true,
    },
    {
      number: 2,
      title: "Submit Engagement Request",
      description: "Tell us about your customer engagement so we can start planning together.",
      href: "/request",
      actionLabel: "Submit Request",
      required: false,
    },
    {
      number: 3,
      title: "Plan Together",
      description: "An Experience Strategist will work with you to design and plan the engagement content.",
      href: null,
      actionLabel: null,
      required: false,
    },
    {
      number: 4,
      title: "Deliver & Follow Up",
      description: "Execute the engagement day and capture next steps for your customer.",
      href: null,
      actionLabel: null,
      required: false,
    },
  ];

  const timelineSteps = [
    {
      id: "request-submissions",
      title: "Request Submissions",
      description: "Put in the initial requests for your customer engagement at the AI Centre.",
      duration: "Week 1",
      icon: <FileText className="w-6 h-6" />,
      status: "completed" as const,
      details: [
        "Log a REWS ticket to secure the space and event support",
        "Submit an engagement request via the AI Centre Slack workflow"
      ]
    },
    {
      id: "initial-consultation",
      title: "Initial Consultation & Discovery",
      description: "Connect with the AI Centre Team to outline engagement objectives.",
      duration: "Week 1-2",
      icon: <MessageSquare className="w-6 h-6" />,
      status: "upcoming" as const,
      details: [
        "Share customer background, AI strategy, and Salesforce footprint",
        "Align on engagement objectives and expected attendees",
        "Receive engagement selection recommendation (1 standard offering + 1 experience)"
      ]
    },
    {
      id: "engagement-planning",
      title: "Engagement Planning",
      description: "Work with an Experience Strategist to design the engagement.",
      duration: "Week 2-3",
      icon: <Target className="w-6 h-6" />,
      status: "upcoming" as const,
      details: [
        "Content planning with slide deck and structure walkthrough",
        "Source SE and/or TA volunteers for technical expertise",
        "Slack channel created for coordination and briefing calls"
      ]
    },
    {
      id: "logistics-coordination",
      title: "Logistics & Coordination",
      description: "REWS event lead handles venue, catering, and guest logistics.",
      duration: "Week 3-4",
      icon: <Users className="w-6 h-6" />,
      status: "upcoming" as const,
      details: [
        "Venue selection and AV setup for your group size",
        "Guest list management and attendee registration",
        "Catering coordination within your budget",
        "Materials and supplies arranged as needed"
      ]
    },
    {
      id: "engagement-delivery",
      title: "Delivery & Follow Up",
      description: "Execute the engagement and capture outcomes.",
      duration: "1-2 Days",
      icon: <Clock className="w-6 h-6" />,
      status: "upcoming" as const,
      details: [
        "AI Centre Team facilitates sessions with account team and SE support",
        "Post-engagement feedback shared with account team",
        "Next steps and future engagement opportunities identified"
      ]
    }
  ];

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-8 section-padding">
        <div className="container-max">
          <div className="max-w-4xl mx-auto text-center">
            <p className="overline mb-3">Detailed Process</p>
            <h1 className="font-serif text-h1 text-ink">
              Full Engagement Timeline
            </h1>
            <p className="text-ink-secondary mt-3 text-lg">
              Everything you need to know about the engagement process from start to finish
            </p>
          </div>
        </div>
      </section>

      {/* Sequential Steps */}
      <section className="py-12 section-padding">
        <div className="container-max">
          <div className="max-w-3xl mx-auto space-y-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`card p-5 flex items-start gap-4 ${
                  step.required ? 'ring-1 ring-warm/30 bg-warm-light' : ''
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                  step.required
                    ? 'bg-warm text-white'
                    : 'bg-surface-muted border-2 border-border text-ink'
                }`}>
                  {step.number}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-ink font-semibold">{step.title}</h3>
                    {step.required && (
                      <span className="bg-warm text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                        Required first
                      </span>
                    )}
                  </div>
                  <p className="text-ink-secondary text-sm mt-1">{step.description}</p>
                </div>

                {step.href && (
                  <a
                    href={step.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0 ${
                      step.required
                        ? 'btn-urgent !py-2'
                        : 'btn-primary !py-2'
                    }`}
                  >
                    {step.actionLabel}
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Facts */}
      <section className="py-8 section-padding">
        <div className="container-max">
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-5 text-center">
              <Clock className="w-5 h-5 text-accent mx-auto mb-2" />
              <h4 className="text-ink font-semibold text-sm">4 weeks minimum</h4>
              <p className="text-ink-tertiary text-xs mt-1">Advance booking required</p>
            </div>
            <div className="card p-5 text-center">
              <Users className="w-5 h-5 text-accent mx-auto mb-2" />
              <h4 className="text-ink font-semibold text-sm">10-25 attendees</h4>
              <p className="text-ink-tertiary text-xs mt-1">Optimal group size</p>
            </div>
            <div className="card p-5 text-center">
              <Target className="w-5 h-5 text-accent mx-auto mb-2" />
              <h4 className="text-ink font-semibold text-sm">1-2 day format</h4>
              <p className="text-ink-tertiary text-xs mt-1">1 standard offering + 1 experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <EngagementTiers />

      {/* Detailed Timeline */}
      <section className="py-12 section-padding">
        <div className="container-max">
          <div className="max-w-6xl mx-auto">
            <Timeline
              steps={timelineSteps}
              title="Detailed Timeline"
              description="Click any step to see what happens and when"
            />
          </div>
        </div>
      </section>

      <ContactBanner />
    </main>
  );
}
