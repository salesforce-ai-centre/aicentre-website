export default function Introduction() {
  return (
    <section className="py-20 section-padding relative">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute top-20 right-10 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-indigo-500 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="container-max relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header with icon */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-white">
              How We Work Together
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-600 mx-auto rounded-full"></div>
          </div>

          {/* Content cards */}
          <div className="grid grid-cols-1 gap-8">
            {/* Card 1 */}
            <div className="glass-card p-8 group border-white border-opacity-15 hover:border-purple-500 hover:border-opacity-50 smooth-hover h-full flex flex-col">
              <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors mb-4">Experience-First Learning</h3>
              <p className="text-white text-opacity-80 leading-relaxed">
                At the AI Centre, we believe that the best way to understand AI is to experience it. 
                We offer a range of proven formats, from short immersive experiences to full-day engagement programmes. 
                Whether your customer is just starting their AI journey or ready to dive into building agents, 
                our standard offerings are designed to spark ideas, drive conversations, and accelerate action.
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass-card p-8 group border-white border-opacity-15 hover:border-purple-500 hover:border-opacity-50 smooth-hover h-full flex flex-col">
              <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors mb-4">You Lead, We Support</h3>
              <p className="text-white text-opacity-80 leading-relaxed">
                You lead the customer experience—we're here to support with content, coordination, and best practices. 
                You choose the sessions that fit. We'll help you deliver and curate them so you can focus on what 
                matters most: your customers.
              </p>
            </div>

            {/* Card 3 */}
            <div className="glass-card p-8 group border-white border-opacity-15 hover:border-purple-500 hover:border-opacity-50 smooth-hover h-full flex flex-col">
              <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors mb-4">Ready to Get Started?</h3>
              <div className="flex-1">
                <p className="text-white text-opacity-80 leading-relaxed">
                  Use this guide to explore our menu of engagements, assemble your agenda, and reach out to the 
                  AI Centre team to support you with bringing it to life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}