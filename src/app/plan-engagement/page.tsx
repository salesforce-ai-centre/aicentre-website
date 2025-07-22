import { getSiteConfig } from '@/lib/content';
import Navigation from '@/components/Navigation';
import ContactBanner from '@/components/ContactBanner';
import Timeline, { engagementTimelineSteps } from '@/components/Timeline';
import { MessageSquare, Clock, Users, Target, CheckCircle, HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Plan Customer Engagement | AI Centre',
  description: 'Your streamlined guide to planning successful AI Centre customer engagements',
};

export default function PlanEngagementPage() {
  const siteConfig = getSiteConfig();

  const quickFacts = [
    {
      icon: <Clock className="w-6 h-6 text-purple-400" />,
      title: "4 weeks minimum",
      description: "Book team-led engagements at least 4 weeks in advance"
    },
    {
      icon: <Users className="w-6 h-6 text-purple-400" />,
      title: "15-25 attendees",
      description: "Optimal group size for maximum engagement impact"
    },
    {
      icon: <Target className="w-6 h-6 text-purple-400" />,
      title: "1-2 day format",
      description: "Workshop + immersive experience combination"
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "Start in Slack",
      description: "Join #ai-centre-uk and share your customer details",
      action: "Post in channel"
    },
    {
      step: "2", 
      title: "Get Matched",
      description: "We'll assign an Experience Strategist to your engagement",
      action: "Wait for assignment"
    },
    {
      step: "3",
      title: "Plan Together", 
      description: "Design the perfect agenda for your customer's needs",
      action: "Collaborate on design"
    },
    {
      step: "4",
      title: "Deliver & Follow-up",
      description: "Execute the engagement and maintain momentum",
      action: "Focus on outcomes"
    }
  ];

  const faqs = [
    {
      question: "What if I need an engagement in less than 4 weeks?",
      answer: "Consider an account team-led engagement where you provide content and we provide the venue."
    },
    {
      question: "Can I customize the workshop content?",
      answer: "Yes! We work with you to tailor content to your customer's specific industry and use cases."
    },
    {
      question: "What's included in every engagement?",
      answer: "One core workshop + one immersive experience (like F1 simulators or Lego City) + lunch and logistics support."
    }
  ];

  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 section-padding">
        <div className="container-max">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-black mb-6 text-white">
              Plan Your Customer Engagement
            </h1>
            <p className="text-xl text-white text-opacity-90 mb-8 max-w-2xl mx-auto">
              A simple process to deliver impactful AI Centre experiences that accelerate deals and build customer trust
            </p>
            
            {/* Primary CTA */}
            <a
              href="https://salesforce.enterprise.slack.com/archives/C080TP9HENQ"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:-translate-y-0.5 mb-12"
            >
              <MessageSquare className="w-6 h-6" />
              <span>Get Started: {siteConfig.contactInfo.slackChannel}</span>
              <span>→</span>
            </a>

            {/* Quick Facts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {quickFacts.map((fact, index) => (
                <div key={index} className="glass-card p-6 text-center">
                  <div className="flex justify-center mb-3">{fact.icon}</div>
                  <h3 className="text-white font-semibold mb-2">{fact.title}</h3>
                  <p className="text-white/70 text-sm">{fact.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Simple Process Overview */}
      <section className="py-12 section-padding bg-white/5">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
            
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
              steps={engagementTimelineSteps}
              title="Detailed Timeline"
              description="Click any step to see what happens and when"
            />
          </div>
        </div>
      </section>

      {/* Key Information */}
      <section className="py-12 section-padding bg-white/5">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Important Details</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Location & Team */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-white mb-4">About the AI Centre</h3>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <span>Located 10 minutes from Salesforce Tower near Blackfriars Bridge</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <span>SE resources pulled from volunteer pool based on expertise needed</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <span>Experience Strategist helps design the perfect engagement</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <span>Operations Lead handles all logistics and coordination</span>
                  </li>
                </ul>
              </div>

              {/* What's Included */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-white mb-4">What&apos;s Included</h3>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <span>One core workshop (Agentforce Lab, Agent Challenge, Executive Keynote, etc.)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <span>One immersive experience (F1 simulators, Lego City, demos)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <span>Venue space, guest passes, and lunch coordination</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <span>Expert SE facilitation and post-engagement follow-up</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 section-padding">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Common Questions</h2>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="glass-card p-6">
                  <h3 className="text-white font-semibold mb-3 flex items-start">
                    <HelpCircle className="w-5 h-5 text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
                    {faq.question}
                  </h3>
                  <p className="text-white/80 ml-8">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 section-padding bg-gradient-to-r from-purple-600/20 to-indigo-600/20">
        <div className="container-max">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-white/90 mb-8">
              Join our Slack channel to begin planning your next AI Centre customer experience.
            </p>
            <a
              href="https://salesforce.enterprise.slack.com/archives/C080TP9HENQ"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              <MessageSquare className="w-6 h-6" />
              <span>Join {siteConfig.contactInfo.slackChannel}</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      <ContactBanner />
    </main>
  );
}