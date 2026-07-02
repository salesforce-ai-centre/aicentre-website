'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { useUser } from '@/contexts/UserContext';
import { CheckCircle, Loader2, AlertCircle, Plus, X, Building2, Sparkles, CalendarClock, Wrench } from 'lucide-react';
import PeoplePicker, { Person } from '@/components/PeoplePicker';

interface FormData {
  accountName: string;
  opportunityLink: string;
  description: string;
  engagementType: string;
  experience: string;
  experienceTime: string;
  intendedAudience: string;
  attendees: string;
  preferredDate1: string;
  preferredDate2: string;
  preferredDate3: string;
  startTime: string;
  endTime: string;
  locationNotes: string;
  avRequired: boolean;
  avType: string;
  avFilmed: boolean;
  avDetails: string;
  fbRequired: boolean;
  fbType: string;
  fbAlcohol: boolean;
  fbDetails: string;
  vendorsRequired: boolean;
  vendorsDetails: string;
}

const AUDIENCE_OPTIONS = [
  'C-Suite / Executive',
  'VP / Director',
  'Technical (Architects / Developers)',
  'Business Users / End Users',
  'Mixed Audience',
];

const TIME_OPTIONS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00',
];

export default function RequestPage() {
  const { user } = useUser();
  const [formData, setFormData] = useState<FormData>({
    accountName: '',
    opportunityLink: '',
    description: '',
    engagementType: '',
    experience: '',
    experienceTime: '',
    intendedAudience: '',
    attendees: '',
    preferredDate1: '',
    preferredDate2: '',
    preferredDate3: '',
    startTime: '09:00',
    endTime: '17:00',
    locationNotes: '',
    avRequired: false,
    avType: '',
    avFilmed: false,
    avDetails: '',
    fbRequired: false,
    fbType: '',
    fbAlcohol: false,
    fbDetails: '',
    vendorsRequired: false,
    vendorsDetails: '',
  });
  const [accountTeam, setAccountTeam] = useState<Person[]>([]);
  const [onsiteContact, setOnsiteContact] = useState<Person[]>([]);
  const [workshops, setWorkshops] = useState<{ id: string; title: string }[]>([]);
  const [experiences, setExperiences] = useState<{ id: string; title: string; duration: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [showDate2, setShowDate2] = useState(false);
  const [showDate3, setShowDate3] = useState(false);

  useEffect(() => {
    if (user?.name && user?.email && accountTeam.length === 0) {
      setAccountTeam([{ id: 'self', name: user.name, title: '', email: user.email, photoUrl: user.avatarUrl || '' }]);
      setOnsiteContact([{ id: 'self', name: user.name, title: '', email: user.email, photoUrl: user.avatarUrl || '' }]);
    }
  }, [user]);

  useEffect(() => {
    fetch('/api/workshops')
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setWorkshops(res.data.map((w: any) => ({ id: w.id, title: w.title })));
        else setWorkshops([]);
      })
      .catch(() => setWorkshops([]));

    fetch('/api/experiences')
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setExperiences(res.data.map((e: any) => ({ id: e.id, title: e.title, duration: e.duration })));
        else setExperiences([]);
      })
      .catch(() => setExperiences([]));
  }, []);

  const update = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/requests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          accountTeam: accountTeam.map(p => ({ name: p.name, email: p.email })),
          onsiteContact: onsiteContact[0] ? { name: onsiteContact[0].name, email: onsiteContact[0].email } : null,
          internalAttendees: accountTeam.length,
          floor: '01',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Submission failed');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <section className="pt-32 pb-20 section-padding">
          <div className="container-max">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="font-serif text-h2 text-ink mb-3">Request Submitted</h1>
              <p className="text-ink-secondary text-lg mb-8">
                Your engagement request for <strong>{formData.accountName}</strong> has been received.
                The AI Centre team will review it and reach out to begin planning.
              </p>
              <div className="card p-6 text-left space-y-3 mb-8">
                <h3 className="font-semibold text-ink text-sm">What happens next:</h3>
                <ul className="text-ink-secondary text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-xs font-bold">1</span>
                    </span>
                    A REWS venue booking has been created automatically
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-xs font-bold">2</span>
                    </span>
                    The AI Centre team will review and confirm your dates
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-xs font-bold">3</span>
                    </span>
                    An Experience Strategist will be assigned to your engagement
                  </li>
                </ul>
              </div>
              <div className="flex gap-3 justify-center">
                <a href="/" className="btn-primary">Back to Home</a>
                <button onClick={() => { setSubmitted(false); setFormData({ accountName: '', opportunityLink: '', description: '', engagementType: '', experience: '', experienceTime: '', intendedAudience: '', attendees: '', preferredDate1: '', preferredDate2: '', preferredDate3: '', startTime: '09:00', endTime: '17:00', locationNotes: '', avRequired: false, avType: '', avFilmed: false, avDetails: '', fbRequired: false, fbType: '', fbAlcohol: false, fbDetails: '', vendorsRequired: false, vendorsDetails: '' }); setAccountTeam(user ? [{ id: 'self', name: user.name, title: '', email: user.email, photoUrl: user.avatarUrl || '' }] : []); setOnsiteContact(user ? [{ id: 'self', name: user.name, title: '', email: user.email, photoUrl: user.avatarUrl || '' }] : []); }} className="btn-secondary">
                  Submit Another
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const showExperienceTime = formData.experience !== '' && formData.experience !== 'none';

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-8 section-padding">
        <div className="container-max">
          <div className="max-w-2xl mx-auto text-center">
            <p className="overline mb-3">Step 2</p>
            <h1 className="font-serif text-h1 text-ink">
              Submit Engagement Request
            </h1>
            <p className="text-ink-secondary mt-3 text-lg">
              Tell us about your customer engagement so we can start planning together.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20 section-padding">
        <div className="container-max">
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
            {/* Account Details */}
            <fieldset className="card p-6 space-y-5 shadow-[0_2px_20px_-4px_rgba(99,91,255,0.12)]">
              <legend className="flex items-center gap-2 -mt-1">
                <Building2 size={16} className="text-accent" />
                <span className="text-ink font-semibold text-sm uppercase tracking-wider">Account Details</span>
              </legend>

              <div>
                <label htmlFor="accountName" className="block text-sm font-medium text-ink mb-1.5">
                  Account name <span className="text-warm">*</span>
                </label>
                <input
                  id="accountName"
                  type="text"
                  required
                  placeholder="e.g. Acme Corporation"
                  value={formData.accountName}
                  onChange={(e) => update('accountName', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm"
                />
              </div>

              <div>
                <label htmlFor="opportunityLink" className="block text-sm font-medium text-ink mb-1.5">
                  Opportunity link <span className="text-ink-tertiary">(optional)</span>
                </label>
                <input
                  id="opportunityLink"
                  type="url"
                  placeholder="Paste the org62 opportunity URL"
                  value={formData.opportunityLink}
                  onChange={(e) => update('opportunityLink', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm"
                />
              </div>

              <PeoplePicker
                label="Account team"
                required
                multiple
                value={accountTeam}
                onChange={setAccountTeam}
                placeholder="Search by name (AE, SE, CSM...)"
                hint="You're included by default. Add all Salesforce team members attending."
              />

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-ink mb-1.5">
                  Engagement description <span className="text-warm">*</span>
                </label>
                <textarea
                  id="description"
                  required
                  rows={4}
                  placeholder="Describe the engagement you're planning — objectives, context, what you'd like to achieve"
                  value={formData.description}
                  onChange={(e) => update('description', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm resize-none"
                />
              </div>
            </fieldset>

            {/* Engagement Options */}
            <fieldset className="card p-6 space-y-5 shadow-[0_2px_20px_-4px_rgba(255,107,53,0.12)]">
              <legend className="flex items-center gap-2 -mt-1">
                <Sparkles size={16} className="text-warm" />
                <span className="text-ink font-semibold text-sm uppercase tracking-wider">Engagement Options</span>
              </legend>

              <div>
                <label htmlFor="engagementType" className="block text-sm font-medium text-ink mb-1.5">
                  Standard engagement programme <span className="text-ink-tertiary">(optional)</span>
                </label>
                <select
                  id="engagementType"
                  value={formData.engagementType}
                  onChange={(e) => update('engagementType', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm appearance-none"
                >
                  <option value="">Select a programme</option>
                  {workshops.map((w) => (
                    <option key={w.id} value={w.id}>{w.title}</option>
                  ))}
                  <option value="other">Other</option>
                </select>
                <p className="text-ink-tertiary text-xs mt-1.5">4 weeks minimum notice required. Select &quot;Other&quot; for custom engagements.</p>
              </div>

              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-ink mb-1.5">
                  Guided experience <span className="text-ink-tertiary">(optional)</span>
                </label>
                <select
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => update('experience', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm appearance-none"
                >
                  <option value="">None</option>
                  {experiences.map((exp) => (
                    <option key={exp.id} value={exp.id}>{exp.title} ({exp.duration})</option>
                  ))}
                </select>
                <p className="text-ink-tertiary text-xs mt-1.5">Add an immersive experience to your engagement agenda</p>
              </div>

              {showExperienceTime && (
                <div className="animate-fade-in">
                  <label htmlFor="experienceTime" className="block text-sm font-medium text-ink mb-1.5">
                    Allocated time for experience
                  </label>
                  <input
                    id="experienceTime"
                    type="text"
                    placeholder="e.g. 45 minutes after lunch"
                    value={formData.experienceTime}
                    onChange={(e) => update('experienceTime', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm"
                  />
                  <p className="text-ink-tertiary text-xs mt-1.5">How much time in your agenda is allocated for this experience?</p>
                </div>
              )}
            </fieldset>

            {/* Logistics */}
            <fieldset className="card p-6 space-y-5 shadow-[0_2px_20px_-4px_rgba(10,37,64,0.10)]">
              <legend className="flex items-center gap-2 -mt-1">
                <CalendarClock size={16} className="text-ink" />
                <span className="text-ink font-semibold text-sm uppercase tracking-wider">Logistics</span>
              </legend>

              <div>
                <label htmlFor="intendedAudience" className="block text-sm font-medium text-ink mb-1.5">
                  Intended audience <span className="text-warm">*</span>
                </label>
                <select
                  id="intendedAudience"
                  required
                  value={formData.intendedAudience}
                  onChange={(e) => update('intendedAudience', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm appearance-none"
                >
                  <option value="">Select audience type</option>
                  {AUDIENCE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="attendees" className="block text-sm font-medium text-ink mb-1.5">
                  Number of attendees <span className="text-warm">*</span>
                </label>
                <input
                  id="attendees"
                  type="number"
                  required
                  min={1}
                  placeholder="e.g. 15"
                  value={formData.attendees}
                  onChange={(e) => update('attendees', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm"
                />
              </div>

              {/* Dates */}
              <div>
                <label htmlFor="preferredDate1" className="block text-sm font-medium text-ink mb-1.5">
                  Preferred date <span className="text-warm">*</span>
                </label>
                <input
                  id="preferredDate1"
                  type="date"
                  required
                  value={formData.preferredDate1}
                  onChange={(e) => { update('preferredDate1', e.target.value); setShowDate2(true); }}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm"
                />
              </div>

              {showDate2 && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="preferredDate2" className="block text-sm font-medium text-ink">
                      Alternative date <span className="text-ink-tertiary">(optional)</span>
                    </label>
                    {!showDate3 && formData.preferredDate2 && (
                      <button type="button" onClick={() => setShowDate3(true)} className="text-accent text-xs font-medium flex items-center gap-0.5 hover:text-accent-dark transition-colors">
                        <Plus size={12} /> Add another
                      </button>
                    )}
                  </div>
                  <input
                    id="preferredDate2"
                    type="date"
                    value={formData.preferredDate2}
                    onChange={(e) => { update('preferredDate2', e.target.value); if (e.target.value) setShowDate3(true); }}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm"
                  />
                </div>
              )}

              {showDate3 && (
                <div className="animate-fade-in">
                  <label htmlFor="preferredDate3" className="block text-sm font-medium text-ink mb-1.5">
                    Alternative date <span className="text-ink-tertiary">(optional)</span>
                  </label>
                  <input
                    id="preferredDate3"
                    type="date"
                    value={formData.preferredDate3}
                    onChange={(e) => update('preferredDate3', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm"
                  />
                </div>
              )}

              {/* Venue & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-ink mb-1.5">
                    Start time <span className="text-warm">*</span>
                  </label>
                  <select
                    id="startTime"
                    required
                    value={formData.startTime}
                    onChange={(e) => update('startTime', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm appearance-none"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-ink mb-1.5">
                    End time <span className="text-warm">*</span>
                  </label>
                  <select
                    id="endTime"
                    required
                    value={formData.endTime}
                    onChange={(e) => update('endTime', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm appearance-none"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <PeoplePicker
                label="On-site contact"
                multiple={false}
                value={onsiteContact}
                onChange={setOnsiteContact}
                placeholder="Search by name..."
                hint="Defaults to you. Change if someone else will be the day-of contact."
              />

              <div>
                <label htmlFor="locationNotes" className="block text-sm font-medium text-ink mb-1.5">
                  Location-specific notes <span className="text-ink-tertiary">(optional)</span>
                </label>
                <textarea
                  id="locationNotes"
                  rows={2}
                  placeholder="Any special requirements for the space"
                  value={formData.locationNotes}
                  onChange={(e) => update('locationNotes', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm resize-none"
                />
              </div>
            </fieldset>

            {/* Services & Amenities */}
            <fieldset className="rounded-2xl border border-dashed border-border bg-surface-muted/50 p-6 space-y-5">
              <legend className="flex items-center gap-2 -mt-1">
                <Wrench size={16} className="text-ink-tertiary" />
                <span className="text-ink-secondary font-semibold text-sm uppercase tracking-wider">Services &amp; Amenities</span>
              </legend>
              <p className="text-ink-tertiary text-sm -mt-2">Optional — select if needed. A REWS booking is raised automatically.</p>

              {/* Audio/Visual */}
              <div className="rounded-xl border border-border overflow-hidden">
                <label className="flex items-center gap-3 px-4 py-3 cursor-pointer bg-surface hover:bg-muted/30 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.avRequired}
                    onChange={(e) => setFormData((prev) => ({ ...prev, avRequired: e.target.checked }))}
                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent/30"
                  />
                  <div>
                    <span className="text-sm font-medium text-ink">Audio/Visual</span>
                    <span className="text-ink-tertiary text-xs ml-2">projectors, video, filming, microphones</span>
                  </div>
                </label>
                {formData.avRequired && (
                  <div className="px-4 py-4 border-t border-border bg-muted/20 space-y-4 animate-fade-in">
                    <div>
                      <p className="text-sm font-medium text-ink mb-2">Which best describes the support you need?</p>
                      <div className="space-y-2">
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input type="radio" name="avType" value="non-standard" checked={formData.avType === 'non-standard'} onChange={(e) => update('avType', e.target.value)} className="mt-0.5" />
                          <span className="text-sm text-ink">Support needed — Non-standard equipment (microphones, production, specialty AV)</span>
                        </label>
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input type="radio" name="avType" value="standard" checked={formData.avType === 'standard'} onChange={(e) => update('avType', e.target.value)} className="mt-0.5" />
                          <span className="text-sm text-ink">No support needed — Standard conference room equipment (Google Meet + TV)</span>
                        </label>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.avFilmed} onChange={(e) => setFormData((prev) => ({ ...prev, avFilmed: e.target.checked }))} className="w-4 h-4 rounded border-border text-accent focus:ring-accent/30" />
                      <span className="text-sm text-ink">This event will be filmed <span className="text-ink-tertiary">(additional approvals required)</span></span>
                    </label>
                    <div>
                      <label htmlFor="avDetails" className="block text-xs font-medium text-ink-secondary mb-1">Additional AV details</label>
                      <textarea
                        id="avDetails"
                        rows={2}
                        placeholder="Describe your AV requirements..."
                        value={formData.avDetails}
                        onChange={(e) => update('avDetails', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Food & Beverages */}
              <div className="rounded-xl border border-border overflow-hidden">
                <label className="flex items-center gap-3 px-4 py-3 cursor-pointer bg-surface hover:bg-muted/30 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.fbRequired}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fbRequired: e.target.checked }))}
                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent/30"
                  />
                  <div>
                    <span className="text-sm font-medium text-ink">Food &amp; Beverages</span>
                    <span className="text-ink-tertiary text-xs ml-2">self-service delivery, outside catering</span>
                  </div>
                </label>
                {formData.fbRequired && (
                  <div className="px-4 py-4 border-t border-border bg-muted/20 space-y-4 animate-fade-in">
                    <div>
                      <p className="text-sm font-medium text-ink mb-2">Which best describes your food &amp; beverage needs?</p>
                      <div className="space-y-2">
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input type="radio" name="fbType" value="self-order" checked={formData.fbType === 'self-order'} onChange={(e) => update('fbType', e.target.value)} className="mt-0.5" />
                          <span className="text-sm text-ink">I&apos;ll order catering myself</span>
                        </label>
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input type="radio" name="fbType" value="need-help" checked={formData.fbType === 'need-help'} onChange={(e) => update('fbType', e.target.value)} className="mt-0.5" />
                          <span className="text-sm text-ink">I need help ordering from an external caterer</span>
                        </label>
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input type="radio" name="fbType" value="other" checked={formData.fbType === 'other'} onChange={(e) => update('fbType', e.target.value)} className="mt-0.5" />
                          <span className="text-sm text-ink">I have other food and beverage needs</span>
                        </label>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.fbAlcohol} onChange={(e) => setFormData((prev) => ({ ...prev, fbAlcohol: e.target.checked }))} className="w-4 h-4 rounded border-border text-accent focus:ring-accent/30" />
                      <span className="text-sm text-ink">Alcoholic beverages will be served</span>
                    </label>
                    <div>
                      <label htmlFor="fbDetails" className="block text-xs font-medium text-ink-secondary mb-1">Additional F&amp;B details</label>
                      <textarea
                        id="fbDetails"
                        rows={2}
                        placeholder="Describe your food and beverage requirements..."
                        value={formData.fbDetails}
                        onChange={(e) => update('fbDetails', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Outside Vendors */}
              <div className="rounded-xl border border-border overflow-hidden">
                <label className="flex items-center gap-3 px-4 py-3 cursor-pointer bg-surface hover:bg-muted/30 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.vendorsRequired}
                    onChange={(e) => setFormData((prev) => ({ ...prev, vendorsRequired: e.target.checked }))}
                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent/30"
                  />
                  <div>
                    <span className="text-sm font-medium text-ink">Outside Vendors</span>
                    <span className="text-ink-tertiary text-xs ml-2">entertainment, decorations, rentals</span>
                  </div>
                </label>
                {formData.vendorsRequired && (
                  <div className="px-4 py-4 border-t border-border bg-muted/20 space-y-4 animate-fade-in">
                    <p className="text-sm text-ink">I am interested in hiring outside services and have the budget.</p>
                    <div>
                      <label htmlFor="vendorsDetails" className="block text-xs font-medium text-ink-secondary mb-1">Additional vendor details</label>
                      <textarea
                        id="vendorsDetails"
                        rows={2}
                        placeholder="Describe the outside vendor services you need..."
                        value={formData.vendorsDetails}
                        onChange={(e) => update('vendorsDetails', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </fieldset>

            {/* Submit */}
            <div className="bg-surface-muted/50 rounded-2xl p-6 space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Engagement Request'
                )}
              </button>
              <p className="text-ink-tertiary text-xs text-center">
                This will notify the AI Centre team, create a tracking record, and raise a REWS venue booking.
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
