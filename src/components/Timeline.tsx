'use client';

import { CheckCircle, Clock, Calendar, Users, Target, Rocket, MessageSquare, FileText, Lightbulb, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: React.ReactNode;
  status: 'completed' | 'current' | 'upcoming';
  details: string[];
  tips?: string[];
}

interface TimelineProps {
  steps: TimelineStep[];
  title?: string;
  description?: string;
}

export default function Timeline({ steps, title = "Engagement Timeline", description }: TimelineProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const toggleStep = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const getStepStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          dot: 'bg-green-50 border-green-500',
          line: 'bg-green-500',
          card: 'border-green-200 bg-green-50/50',
          icon: 'text-green-600',
          title: 'text-ink',
          badge: 'bg-green-100 text-green-700'
        };
      case 'current':
        return {
          dot: 'bg-accent-light border-accent',
          line: 'bg-accent',
          card: 'border-accent/30 bg-accent-light/50 ring-1 ring-accent/20',
          icon: 'text-accent',
          title: 'text-ink font-bold',
          badge: 'bg-accent text-white'
        };
      default:
        return {
          dot: 'bg-surface-muted border-border',
          line: 'bg-border',
          card: 'border-border bg-surface-elevated',
          icon: 'text-ink-tertiary',
          title: 'text-ink',
          badge: 'bg-surface-muted text-ink-secondary'
        };
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="font-serif text-h2 text-ink mb-3">{title}</h2>
        {description && (
          <p className="text-ink-secondary max-w-3xl mx-auto">{description}</p>
        )}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="hidden lg:block absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>

        <div className="space-y-6">
          {steps.map((step, index) => {
            const styles = getStepStyles(step.status);
            const isExpanded = expandedStep === step.id;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.id} className="relative">
                {/* Desktop Layout */}
                <div className="hidden lg:flex items-start">
                  <div className="relative flex-shrink-0">
                    <div className={`w-16 h-16 rounded-full border-2 ${styles.dot} flex items-center justify-center z-10 relative`}>
                      <div className={`${styles.icon}`}>
                        {step.icon}
                      </div>
                    </div>

                    {!isLast && (
                      <div className={`absolute top-16 left-1/2 transform -translate-x-1/2 w-0.5 h-6 ${styles.line}`}></div>
                    )}
                  </div>

                  <div className="ml-6 flex-1">
                    <div
                      className={`card p-5 cursor-pointer transition-all duration-200 hover:shadow-card-hover ${styles.card}`}
                      onClick={() => toggleStep(step.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1.5">
                            <h3 className={`text-lg font-semibold ${styles.title}`}>{step.title}</h3>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles.badge}`}>
                              {step.duration}
                            </span>
                          </div>
                          <p className="text-ink-secondary text-sm leading-relaxed">{step.description}</p>
                        </div>

                        <div className="ml-4">
                          <div className={`w-7 h-7 rounded-full bg-surface-muted border border-border flex items-center justify-center cursor-pointer text-ink-tertiary text-xs`}>
                            <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                              ▼
                            </div>
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 space-y-4 animate-fade-in">
                          <div>
                            <h4 className="text-ink font-semibold text-sm mb-2">Key Activities:</h4>
                            <ul className="space-y-1.5">
                              {step.details.map((detail, idx) => (
                                <li key={idx} className="flex items-start space-x-2">
                                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-ink-secondary text-sm">{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {step.tips && step.tips.length > 0 && (
                            <div className="border-t border-border pt-3">
                              <h4 className="text-ink font-semibold text-sm mb-2 flex items-center">
                                <Lightbulb className="w-4 h-4 text-amber-500 mr-2" />
                                Pro Tips:
                              </h4>
                              <ul className="space-y-1.5">
                                {step.tips.map((tip, idx) => (
                                  <li key={idx} className="flex items-start space-x-2">
                                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-ink-secondary text-sm italic">{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="lg:hidden">
                  <div
                    className={`card p-5 cursor-pointer transition-all duration-200 ${styles.card}`}
                    onClick={() => toggleStep(step.id)}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-10 h-10 rounded-full border-2 ${styles.dot} flex items-center justify-center flex-shrink-0`}>
                        <div className={`${styles.icon} [&>svg]:w-4 [&>svg]:h-4`}>
                          {step.icon}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-0.5">
                          <h3 className={`text-base font-semibold ${styles.title} truncate`}>{step.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${styles.badge}`}>
                            {step.duration}
                          </span>
                        </div>
                        <p className="text-ink-secondary text-sm">{step.description}</p>
                      </div>

                      <div className={`w-6 h-6 rounded-full bg-surface-muted border border-border flex items-center justify-center text-ink-tertiary text-xs flex-shrink-0`}>
                        <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                          ▼
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-3 space-y-3 animate-fade-in">
                        <div>
                          <h4 className="text-ink font-semibold text-sm mb-2">Key Activities:</h4>
                          <ul className="space-y-1.5">
                            {step.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-ink-secondary text-sm">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {step.tips && step.tips.length > 0 && (
                          <div className="border-t border-border pt-3">
                            <h4 className="text-ink font-semibold text-sm mb-2 flex items-center">
                              <Lightbulb className="w-4 h-4 text-amber-500 mr-2" />
                              Pro Tips:
                            </h4>
                            <ul className="space-y-1.5">
                              {step.tips.map((tip, idx) => (
                                <li key={idx} className="flex items-start space-x-2">
                                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-ink-secondary text-sm italic">{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {!isLast && (
                    <div className="flex justify-center my-3">
                      <div className={`w-0.5 h-6 ${styles.line}`}></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const engagementTimelineSteps: TimelineStep[] = [
  {
    id: 'initial-contact',
    title: 'Initial Contact & Discovery',
    description: 'Connect with the AI Centre team and discuss your customer\'s specific needs and objectives.',
    duration: 'Week 1',
    icon: <MessageSquare className="w-6 h-6" />,
    status: 'completed',
    details: [
      'Join #ai-centre-uk Slack channel',
      'Share customer background, industry, and use cases',
      'Discuss desired outcomes and success metrics',
      'Identify key stakeholders and decision makers',
      'Assess customer\'s AI maturity level',
      'Confirm engagement objectives and scope'
    ],
    tips: [
      'Provide detailed customer context upfront to get better recommendations',
      'Include both technical and business stakeholders in initial discussions',
      'Have clear success criteria defined before proceeding'
    ]
  },
  {
    id: 'planning-design',
    title: 'Planning & Design',
    description: 'Work with Experience Strategist to design the perfect engagement for your customer.',
    duration: 'Week 2',
    icon: <Target className="w-6 h-6" />,
    status: 'upcoming',
    details: [
      'Assigned Experience Strategist consultation call',
      'Select appropriate workshop format and content',
      'Choose complementary immersive experience',
      'Customize agenda for customer-specific use cases',
      'Confirm participant list and roles',
      'Complete AI Centre Workflow documentation',
      'Submit REWS ticket for venue booking'
    ],
    tips: [
      'Book 4-6 weeks in advance for optimal resource availability',
      'Consider mixing different seniority levels for better ideation',
      'Align workshop complexity with customer\'s technical capabilities'
    ]
  },
  {
    id: 'logistics-coordination',
    title: 'Logistics & Coordination',
    description: 'Operations Lead handles all practical arrangements while SE resources are confirmed.',
    duration: 'Week 3',
    icon: <Calendar className="w-6 h-6" />,
    status: 'upcoming',
    details: [
      'Operations Lead assigned and introduced',
      'Venue space confirmed and set up arranged',
      'Guest passes organized for all attendees',
      'Lunch and catering coordinated',
      'SE delivery resources confirmed and briefed',
      'Travel and accommodation support (if needed)',
      'Pre-engagement materials prepared'
    ],
    tips: [
      'Share participant dietary requirements early',
      'Coordinate with customer on any security clearance needs',
      'Prepare customer for what to expect on the day'
    ]
  },
  {
    id: 'pre-engagement',
    title: 'Pre-Engagement Preparation',
    description: 'Final preparations, team briefings, and customer communications before the big day.',
    duration: 'Week 4',
    icon: <FileText className="w-6 h-6" />,
    status: 'upcoming',
    details: [
      'SE team briefing and customer context sharing',
      'Final agenda confirmation with customer',
      'Pre-engagement call with key stakeholders',
      'Prepare customer-specific use case examples',
      'Technical setup and equipment testing',
      'Print materials and setup immersive experience',
      'Confirm final headcount and logistics'
    ],
    tips: [
      'Schedule pre-call 2-3 days before engagement',
      'Have backup plans for technical demonstrations',
      'Brief customer on participation expectations'
    ]
  },
  {
    id: 'delivery',
    title: 'Engagement Delivery',
    description: 'Execute the planned engagement with expert facilitation and immersive experiences.',
    duration: '1-2 Days',
    icon: <Users className="w-6 h-6" />,
    status: 'upcoming',
    details: [
      'Welcome and introductions with AI Centre overview',
      'Facilitated ideation sessions with breakout groups',
      'Technical demonstrations and hands-on building',
      'Immersive experience participation',
      'Group presentations and idea sharing',
      'Governance and implementation Q&A session',
      'Next steps discussion and planning'
    ],
    tips: [
      'Encourage active participation from all attendees',
      'Capture ideas and insights throughout the day',
      'Use breaks for informal networking and relationship building'
    ]
  },
  {
    id: 'follow-up',
    title: 'Follow-up & Momentum',
    description: 'Maintain engagement momentum with structured follow-up and continued support.',
    duration: 'Week 5-6',
    icon: <TrendingUp className="w-6 h-6" />,
    status: 'upcoming',
    details: [
      'Post-engagement summary document creation',
      'Share presentation materials and resources',
      'Schedule follow-up call within 48 hours',
      'Connect customer with relevant SEs for ongoing support',
      'Identify concrete next steps and timeline',
      'Plan additional engagements if needed',
      'Measure satisfaction and collect feedback'
    ],
    tips: [
      'Strike while the iron is hot - follow up immediately',
      'Provide actionable next steps, not just general advice',
      'Keep the conversation going with regular check-ins'
    ]
  }
];
