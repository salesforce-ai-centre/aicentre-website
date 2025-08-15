import { getSiteConfig } from '@/lib/content';
import Navigation from '@/components/Navigation';
import ContactBanner from '@/components/ContactBanner';
import Timeline, { engagementTimelineSteps } from '@/components/Timeline';
import { MessageSquare, Clock, Users, Target, CheckCircle, HelpCircle, ExternalLink, FileText } from 'lucide-react';

export const metadata = {
  title: 'Plan Customer Engagement | AI Centre',
  description: 'Your streamlined guide to planning successful AI Centre customer engagements',
};

export default function PlanEngagementPage() {
  const siteConfig = getSiteConfig();

  const getStartedLinks = [
    {
      title: "Customer Engagement Request Workflow",
      description: "Submit an engagement request",
      href: "https://salesforce.enterprise.slack.com/archives/C080TP9HENQ",
      icon: <FileText className="w-6 h-6 text-purple-400" />
    },
    {
      title: "Log a REWS ticket",
      description: "Secure space in the AI Centre",
      href: "https://rews.my.site.com/REWS/requestform",
      icon: <ExternalLink className="w-6 h-6 text-purple-400" />
    }
  ];

  const aiCentreTeamFacts = [
    {
      icon: <Clock className="w-6 h-6 text-purple-400" />,
      title: "4 weeks minimum",
      description: "Book an engagement at least 4 weeks in advance"
    },
    {
      icon: <Users className="w-6 h-6 text-purple-400" />,
      title: "10-25 attendees",
      description: "Optimal group size for maximum engagement impact"
    },
    {
      icon: <Target className="w-6 h-6 text-purple-400" />,
      title: "1-2 day format",
      description: "All engagements include one standard offering and one immersive experience"
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "Submit an engagement request",
      description: "Submit an engagement request",
      action: "Start the process"
    },
    {
      step: "2", 
      title: "Submit a REWS ticket",
      description: "Log a REWS ticket to secure the space in the AI Centre",
      action: "Secure venue"
    },
    {
      step: "3",
      title: "Plan Together", 
      description: "Design the perfect engagement for your customers with the AI Centre Team and REWS",
      action: "Collaborate on design"
    },
    {
      step: "4",
      title: "Deliver & Follow Up",
      description: "Execute the engagement and plan the next steps for the account",
      action: "Focus on outcomes"
    }
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
        "Submit an engagement request - Submit an engagement request via the AI Centre Customer Engagement request workflow.",
        "Submit a REWS ticket - When the engagement and availability is confirmed with the AI Centre Team, log a REWS ticket to secure the space in the AI Centre"
      ]
    },
    {
      id: "initial-consultation",
      title: "Initial Consultation and Discovery",
      description: "Connect with the AI Centre Team and outline the objectives of the engagement.",
      duration: "Week 1-2",
      icon: <MessageSquare className="w-6 h-6" />,
      status: "current" as const,
      details: [
        "Customer background: Account Team shares details about the customer including open opportunities, AI strategy, current Salesforce footprint",
        "Engagement objectives: Engagement Account team shares the objectives of the engagement, the expected attendees (inc. number of attendees) and next steps for the customers",
        "Engagement selection: Based on the requirements of the session, an engagement (1 standard offering and 1 experience) will be recommended to the account team and the next steps of the process"
      ]
    },
    {
      id: "engagement-planning",
      title: "Engagement Planning",
      description: "Work with an Experience Strategist to design a memorable engagement for your customers",
      duration: "Week 2-3",
      icon: <Target className="w-6 h-6" />,
      status: "upcoming" as const,
      details: [
        "Content: The Experience Strategist will share the planning document, the slide deck template of the chosen standard offering and walk through the structure of the experience activity. The account team and Experience Strategist will work together plan out the delivery of the content.",
        "Resource support: The account team and Experience Strategist will source SE and/or TA volunteers to provide technical expertise during the engagement",
        "Communication: Slack channel will be created to coordinate the engagement planning, SE volunteers will have a briefing call to walk through the roles and responsibilities on the day, Check in calls with the account team, Experience Strategist and REWS event lead"
      ]
    },
    {
      id: "logistics-coordination",
      title: "Logistics and Coordination",
      description: "Collaborate with a REWS event lead to create a day of top-tier customer hospitality at the AI Centre",
      duration: "Week 3-4",
      icon: <Users className="w-6 h-6" />,
      status: "upcoming" as const,
      details: [
        "Venue space and technology: Support is provided to select a space in the AI Centre that fits the expected attendee count and engagement objectives. AV requirements will also be coordinated to ensure the space is appropriately equipped.",
        "Guest list management: The event lead will assist with managing the guest list and registering attendees, including both internal employees and external guests.",
        "Catering: Catering can be selected and ordered on the behalf of the account team, with menu options tailored to fit the budget you provide.",
        "Additional supplies: Materials such as monitors, stationery, and whiteboards can be arranged as needed to support the engagement."
      ]
    },
    {
      id: "engagement-delivery",
      title: "Engagement Delivery and Follow up",
      description: "Execute the planned engagement and post engagement follow up",
      duration: "1-2 Days",
      icon: <Clock className="w-6 h-6" />,
      status: "upcoming" as const,
      details: [
        "Day of engagement: AI Centre Team facilitates the main sessions of the day with support from the account team and SE volunteers",
        "Post engagement: AI Centre Team will share customer feedback with the account team and identify next steps and future engagements for the account"
      ]
    }
  ];

  return (
    <main className="min-h-screen page-lighter">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 section-padding">
        <div className="container-max">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-black mb-6 text-white">
              Get Started
            </h1>
            
            {/* Get Started Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {getStartedLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="glass-card p-6 text-center hover:bg-white/10 transition-colors group"
                >
                  <div className="flex justify-center mb-3">{link.icon}</div>
                  <h3 className="text-white font-semibold mb-2 group-hover:text-purple-300">{link.title}</h3>
                  <p className="text-white/70 text-sm">{link.description}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Engagement Types */}
      <section className="py-12 section-padding bg-white/5">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-6 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 mb-12">
              <p className="text-white/90">
                AI Centre engagements are managed by the account team with support from the AI Centre Team to bring the engagements to life for your customers.
                <br/><br/>
                Our team focuses on scalable programmes, so for custom engagements, account teams can work with REWS directly to book a space in the AI Centre.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {aiCentreTeamFacts.map((fact, index) => (
                <div key={index} className="glass-card p-6 text-center">
                  <div className="flex justify-center mb-3">{fact.icon}</div>
                  <h3 className="text-white font-semibold mb-2">{fact.title}</h3>
                  <p className="text-white/70 text-sm">{fact.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">How it works:</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                  <p className="text-white/70 text-sm mb-3">{step.description}</p>
                  <span className="text-purple-300 text-xs font-medium bg-purple-500/20 px-3 py-1 rounded-full">
                    {step.action}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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

      {/* Important Details */}
      <section className="py-12 section-padding bg-white/5">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Important Details</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* About the AI Centre */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-white mb-4">About the AI Centre:</h3>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <span>Location: Bluefin Building, 110 Southwark Street, London, SE1 0SU (10 minutes drive from Salesforce Tower near Blackfriars Bridge)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <span>Multiple spaces to cater to your audience size and needs</span>
                  </li>
                </ul>
              </div>

              {/* What's Included */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-white mb-4">What&apos;s Included</h3>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <span>Engagements includes one core workshop (e.g. Agent Challenge) and one immersive experience (e.g. F1 simulators, Lego City)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <span>Engagement support by AI Centre Team and event management by REWS</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <span>Event space, guest passes, workshop supplies and lunch coordination</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactBanner />
    </main>
  );
}