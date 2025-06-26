import { getSiteConfig } from '@/lib/content';
import Image from 'next/image';

export default function ContactBanner() {
  const siteConfig = getSiteConfig();
  
  return (
    <div className="bg-gradient-to-r from-purple-600 to-purple-500 py-5 relative overflow-hidden">
      {/* Diagonal stripe pattern */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            background: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255, 255, 255, 0.03) 10px,
              rgba(255, 255, 255, 0.03) 20px
            )`
          }}
        />
      </div>
      
      <div className="container-max section-padding relative z-10">
        <div className="text-center text-white">
          <div className="text-lg font-semibold flex items-center justify-center space-x-3">
            <Image 
              src="/images/SlackLogo.webp" 
              alt="Slack Logo" 
              width={24} 
              height={24}
            />
            <span>{siteConfig.contactInfo.slackDescription}:</span>
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full font-mono text-sm">
              {siteConfig.contactInfo.slackChannel}
            </span>
          </div>
          <div className="text-sm opacity-80 mt-1">
            {siteConfig.contactInfo.supportDescription}
          </div>
        </div>
      </div>
    </div>
  );
}