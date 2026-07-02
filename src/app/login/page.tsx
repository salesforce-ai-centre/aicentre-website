'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import aiCentreLogo from '../../../public/images/ai-centre-logo.png';
const ERROR_MESSAGES: Record<string, string> = {
  not_salesforce: 'This site is only available to Salesforce employees.',
  token_failed: 'Authentication failed. Please try again.',
  invalid_state: 'Authentication failed. Please try again.',
  missing_params: 'Authentication failed. Please try again.',
  userinfo_failed: 'Could not retrieve your profile. Please try again.',
};

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const errorMessage = error ? ERROR_MESSAGES[error] || 'Something went wrong. Please try again.' : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center section-padding">
      <img
        src={aiCentreLogo.src}
        alt="AI Centre"
        className="mx-auto h-48 w-auto mb-16"
      />
      <div className="w-full max-w-sm text-center space-y-8">
        <div className="space-y-6">
          <p className="text-sm text-ink-secondary">
            Sign in to plan your engagement
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-red-600 text-sm">{errorMessage}</p>
          </div>
        )}

        <a
          href="/api/auth/slack"
          className="flex items-center justify-center gap-3 w-full px-6 py-3 bg-[#4A154B] hover:bg-[#3a1139] text-white font-medium text-sm rounded-lg transition-colors duration-200"
        >
          <svg width="20" height="20" viewBox="0 0 123 123" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#E01E5A"/>
            <path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36C5F0"/>
            <path d="M97.2 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97.2V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.9 5.8 70.7 0 77.8 0s12.9 5.8 12.9 12.9v32.3z" fill="#2EB67D"/>
            <path d="M77.8 97.2c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97.2h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.8z" fill="#ECB22E"/>
          </svg>
          Sign in with Slack
        </a>

        <p className="text-xs text-ink-tertiary">
          Salesforce employees only
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
