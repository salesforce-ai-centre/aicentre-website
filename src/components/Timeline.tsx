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
          dot: 'bg-green-500 border-green-300',
          line: 'bg-green-500',
          card: 'border-green-500/30 bg-green-500/10',
          icon: 'text-green-400',
          title: 'text-white',
          badge: 'bg-green-500 text-white'
        };
      case 'current':
        return {
          dot: 'bg-purple-500 border-purple-300 animate-pulse',
          line: 'bg-gradient-to-b from-green-500 to-purple-500',
          card: 'border-purple-500/50 bg-purple-500/20 ring-2 ring-purple-500/30',
          icon: 'text-purple-400',
          title: 'text-white font-bold',
          badge: 'bg-purple-500 text-white animate-pulse'
        };
      default:
        return {
          dot: 'bg-gray-600 border-gray-500',
          line: 'bg-gray-600',
          card: 'border-gray-600/30 bg-gray-600/10',
          icon: 'text-gray-400',
          title: 'text-white/70',
          badge: 'bg-gray-600 text-white/70'
        };
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
        {description && (
          <p className="text-lg text-white/80 max-w-3xl mx-auto">{description}</p>
        )}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line - hidden on mobile, visible on larger screens */}
        <div className="hidden lg:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-purple-500 to-gray-600"></div>

        <div className="space-y-8">
          {steps.map((step, index) => {
            const styles = getStepStyles(step.status);
            const isExpanded = expandedStep === step.id;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.id} className="relative">
                {/* Desktop Layout */}
                <div className="hidden lg:flex items-start">
                  {/* Timeline dot */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-16 h-16 rounded-full border-4 ${styles.dot} flex items-center justify-center z-10 relative`}>
                      <div className={`${styles.icon}`}>
                        {step.icon}
                      </div>
                    </div>
                    
                    {/* Connecting line to next step */}
                    {!isLast && (
                      <div className={`absolute top-16 left-1/2 transform -translate-x-1/2 w-0.5 h-8 ${styles.line}`}></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="ml-8 flex-1">
                    <div 
                      className={`glass-card p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${styles.card}`}
                      onClick={() => toggleStep(step.id)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className={`text-xl font-bold ${styles.title}`}>{step.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles.badge}`}>
                              {step.duration}
                            </span>
                          </div>
                          <p className="text-white/80 leading-relaxed">{step.description}</p>
                        </div>
                        
                        <div className="ml-4">
                          <div className={`w-8 h-8 rounded-full ${styles.card} flex items-center justify-center cursor-pointer`}>
                            <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                              ▼
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded content */}
                      {isExpanded && (
                        <div className="mt-6 space-y-4 animate-fade-in">
                          <div>
                            <h4 className="text-white font-semibold mb-3">Key Activities:</h4>
                            <ul className="space-y-2">
                              {step.details.map((detail, idx) => (
                                <li key={idx} className="flex items-start space-x-2">
                                  <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                                  <span className="text-white/80 text-sm">{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {step.tips && step.tips.length > 0 && (
                            <div className="border-t border-white/20 pt-4">
                              <h4 className="text-white font-semibold mb-3 flex items-center">
                                <Lightbulb className="w-4 h-4 text-yellow-400 mr-2" />
                                Pro Tips:
                              </h4>
                              <ul className="space-y-2">
                                {step.tips.map((tip, idx) => (
                                  <li key={idx} className="flex items-start space-x-2">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-white/70 text-sm italic">{tip}</span>
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
                    className={`glass-card p-6 cursor-pointer transition-all duration-300 ${styles.card}`}
                    onClick={() => toggleStep(step.id)}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-12 h-12 rounded-full border-4 ${styles.dot} flex items-center justify-center flex-shrink-0`}>
                        <div className={`${styles.icon}`}>
                          {step.icon}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`text-lg font-bold ${styles.title}`}>{step.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles.badge}`}>
                            {step.duration}
                          </span>
                        </div>
                        <p className="text-white/80 text-sm">{step.description}</p>
                      </div>
                      
                      <div className={`w-6 h-6 rounded-full ${styles.card} flex items-center justify-center`}>
                        <div className={`transform transition-transform duration-200 text-xs ${isExpanded ? 'rotate-180' : ''}`}>
                          ▼
                        </div>
                      </div>
                    </div>

                    {/* Mobile expanded content */}
                    {isExpanded && (
                      <div className="mt-4 space-y-4 animate-fade-in">
                        <div>
                          <h4 className="text-white font-semibold mb-3">Key Activities:</h4>
                          <ul className="space-y-2">
                            {step.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                                <span className="text-white/80 text-sm">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {step.tips && step.tips.length > 0 && (
                          <div className="border-t border-white/20 pt-4">
                            <h4 className="text-white font-semibold mb-3 flex items-center">
                              <Lightbulb className="w-4 h-4 text-yellow-400 mr-2" />
                              Pro Tips:
                            </h4>
                            <ul className="space-y-2">
                              {step.tips.map((tip, idx) => (
                                <li key={idx} className="flex items-start space-x-2">
                                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-white/70 text-sm italic">{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Mobile connecting line */}
                  {!isLast && (
                    <div className="flex justify-center my-4">
                      <div className={`w-0.5 h-8 ${styles.line}`}></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-12 bg-gray-800/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Process Progress</h3>
          <span className="text-white/70 text-sm">
            {steps.filter(s => s.status === 'completed').length} / {steps.length} steps
          </span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ 
              width: `${(steps.filter(s => s.status === 'completed').length / steps.length) * 100}%` 
            }}
          ></div>
        </div>
        
        <div className="flex justify-between mt-3 text-xs text-white/60">
          <span>Start</span>
          <span>Complete</span>
        </div>
      </div>
    </div>
  );
}

// Export default timeline data for the engagement process
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
    status: 'current',
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