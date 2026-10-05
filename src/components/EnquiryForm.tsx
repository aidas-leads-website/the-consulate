'use client';

import { track } from '@/lib/track';

// The enquiry opens the guest's email app with the details filled in, addressed to the events inbox.
// No server, no stored data. Without JavaScript the form still submits as a plain mailto.
export function EnquiryForm({ email, phone }: { email: string; phone: string }) {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? '').trim();
    const subject = `Private dining enquiry: ${v('guests') || '?'} guests${v('date') ? `, ${v('date')}` : ''}`;
    const body = [
      `Name: ${v('name')}`,
      `Email: ${v('email')}`,
      ...(v('phone') ? [`Phone: ${v('phone')}`] : []),
      `Date: ${v('date') || 'flexible'}`,
      `Guests: ${v('guests')}`,
      '',
      v('message'),
    ].join('\n');
    track('private_dining_enquiry', { guests: v('guests') });
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form className="form" action={`mailto:${email}`} method="post" encType="text/plain" onSubmit={onSubmit}>
      <div className="field-row">
        <div className="field"><label htmlFor="pd-name">Your name</label><input id="pd-name" name="name" autoComplete="name" required /></div>
        <div className="field"><label htmlFor="pd-email">Email</label><input id="pd-email" name="email" type="email" autoComplete="email" required /></div>
      </div>
      <div className="field-row">
        <div className="field"><label htmlFor="pd-phone">Phone</label><input id="pd-phone" name="phone" type="tel" autoComplete="tel" /></div>
        <div className="field"><label htmlFor="pd-date">Date</label><input id="pd-date" name="date" type="date" /></div>
        <div className="field"><label htmlFor="pd-guests">Guests</label><input id="pd-guests" name="guests" type="number" min={1} max={200} inputMode="numeric" required /></div>
      </div>
      <div className="field"><label htmlFor="pd-message">What are you planning?</label><textarea id="pd-message" name="message" placeholder="A birthday dinner, a team night, a full buyout, a film shoot…" /></div>
      <div className="cta-row" style={{ marginTop: '.4rem' }}><button className="btn" type="submit">Write the enquiry</button></div>
      <p className="form-note">This opens your email app with everything filled in, addressed to {email}. For a large table tonight, call {phone} after 5pm.</p>
    </form>
  );
}
