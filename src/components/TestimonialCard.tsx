import { Testimonial } from '@/types/content';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="glass-card p-8 relative overflow-hidden transition-all duration-300 hover:-translate-y-2.5 hover:shadow-2xl hover:shadow-purple-500 group border-white border-opacity-15 hover:border-purple-500 hover:border-opacity-50">
      {/* Quote icon */}
      <div className="absolute top-4 left-6 text-4xl text-purple-500 text-opacity-30 font-serif">&ldquo;</div>
      
      <div className="mb-6 pl-8">
        <h4 className="font-semibold text-white mb-1">{testimonial.author}</h4>
        <p className="text-sm text-white text-opacity-70 mb-1">{testimonial.role}</p>
        <p className="text-sm text-white text-opacity-60">{testimonial.company}</p>
      </div>

      <blockquote className="text-white text-opacity-90 italic leading-relaxed pl-8">
        {testimonial.quote}
      </blockquote>
    </div>
  );
}