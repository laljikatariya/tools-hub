'use client';

import Link from 'next/link';
import { Header } from '@/app/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { trackContactFormSubmission, trackContactFormInteraction, trackContactPageView } from '@/lib/analytics';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Track page view on mount
  useEffect(() => {
    trackContactPageView();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Track form submission with analytics
    trackContactFormSubmission(
      formData.name,
      formData.email,
      formData.subject || 'unknown',
      formData.message
    );
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    
    setFormData({
      ...formData,
      [fieldName]: fieldValue,
    });
    
    // Track subject selection
    if (fieldName === 'subject' && fieldValue) {
      trackContactFormInteraction('subject_selected', fieldValue);
    }
  };

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Utilo',
    description: 'Contact page for Utilo - Free Online Tools',
    mainEntity: {
      '@type': 'Organization',
      name: 'Utilo',
      url: 'https://utilo.in',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'support@utilo.com',
        contactType: 'Customer Support',
        availableLanguage: 'English',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white via-[#F9FAFB] to-white dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#0F172A]">
        <section className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-[#6B7280] dark:text-gray-400 mb-8">
              <Link href="/" className="hover:text-[#4F46E5] transition-colors">
                Home
              </Link>
              <span>→</span>
              <span className="text-[#111827] dark:text-[#F9FAFB]">Contact Us</span>
            </nav>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left Column - Contact Form */}
              <div>
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4F46E5]/10 dark:bg-[#4F46E5]/20 text-[#4F46E5] text-sm font-medium mb-6">
                    <span>✉️</span>
                    <span>Get in Touch</span>
                  </div>
                  <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#111827] dark:text-[#F9FAFB]">
                    Contact Us
                  </h1>
                  <p className="text-xl text-[#6B7280] dark:text-gray-400">
                    Have a question, suggestion, or feedback? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-[#111827] dark:text-[#F9FAFB] mb-2">
                      Your Name *
                    </label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full h-12 px-4 rounded-xl border-2 border-[#E5E7EB] dark:border-[#334155] focus:border-[#4F46E5] dark:focus:border-[#4F46E5] bg-white dark:bg-[#1E293B]"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-[#111827] dark:text-[#F9FAFB] mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full h-12 px-4 rounded-xl border-2 border-[#E5E7EB] dark:border-[#334155] focus:border-[#4F46E5] dark:focus:border-[#4F46E5] bg-white dark:bg-[#1E293B]"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-[#111827] dark:text-[#F9FAFB] mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full h-12 px-4 rounded-xl border-2 border-[#E5E7EB] dark:border-[#334155] focus:border-[#4F46E5] dark:focus:border-[#4F46E5] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F9FAFB]"
                    >
                      <option value="">Select a subject...</option>
                      <option value="general">General Inquiry</option>
                      <option value="bug">Report a Bug</option>
                      <option value="feature">Feature Request</option>
                      <option value="tool">New Tool Suggestion</option>
                      <option value="feedback">Feedback</option>
                      <option value="business">Business Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-[#111827] dark:text-[#F9FAFB] mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Tell us more about your inquiry..."
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#E5E7EB] dark:border-[#334155] focus:border-[#4F46E5] dark:focus:border-[#4F46E5] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F9FAFB] resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>

                  {/* Success Message */}
                  {submitStatus === 'success' && (
                    <div className="bg-[#10B981]/10 border border-[#10B981] rounded-xl p-4 text-[#10B981]">
                      <p className="font-semibold">✓ Message sent successfully!</p>
                      <p className="text-sm mt-1">We'll get back to you as soon as possible.</p>
                    </div>
                  )}
                </form>
              </div>

              {/* Right Column - Info Cards */}
              <div className="space-y-6">
                {/* Quick Info */}
                <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 border border-[#E5E7EB] dark:border-[#334155]">
                  <h2 className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-6">
                    Other Ways to Reach Us
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Email */}
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">✉️</div>
                      <div>
                        <h3 className="font-semibold text-[#111827] dark:text-[#F9FAFB] mb-1">Email</h3>
                        <a href="mailto:support@utilo.com" className="text-[#4F46E5] hover:underline">
                          support@utilo.com
                        </a>
                        <p className="text-sm text-[#6B7280] dark:text-gray-400 mt-1">
                          We typically respond within 24-48 hours
                        </p>
                      </div>
                    </div>

                    {/* Feedback */}
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">💬</div>
                      <div>
                        <h3 className="font-semibold text-[#111827] dark:text-[#F9FAFB] mb-1">Quick Feedback</h3>
                        <p className="text-[#6B7280] dark:text-gray-400 mb-2">
                          Use the Feedback button in the header for quick suggestions or reports
                        </p>
                      </div>
                    </div>

                    {/* FAQ */}
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">❓</div>
                      <div>
                        <h3 className="font-semibold text-[#111827] dark:text-[#F9FAFB] mb-1">FAQ</h3>
                        <p className="text-[#6B7280] dark:text-gray-400 mb-2">
                          Check our FAQ page for instant answers
                        </p>
                        <Link href="/faq" className="text-[#4F46E5] hover:underline">
                          Visit FAQ →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Response Time */}
                <div className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-2xl p-8 text-white">
                  <h2 className="text-2xl font-bold mb-4">⚡ Quick Response</h2>
                  <p className="text-white/90 mb-4">
                    We value your time and aim to respond to all inquiries within 24-48 hours during business days.
                  </p>
                  <p className="text-sm text-white/80">
                    For urgent bug reports that affect tool functionality, we prioritize responses and aim to address them as quickly as possible.
                  </p>
                </div>

                {/* What to Expect */}
                <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 border border-[#E5E7EB] dark:border-[#334155]">
                  <h2 className="text-xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-4">
                    What We Love to Hear About
                  </h2>
                  <ul className="space-y-3 text-[#6B7280] dark:text-gray-400">
                    <li className="flex items-start gap-3">
                      <span className="text-[#10B981] text-xl">✓</span>
                      <span>Bug reports and technical issues</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#10B981] text-xl">✓</span>
                      <span>New tool suggestions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#10B981] text-xl">✓</span>
                      <span>Feature improvement ideas</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#10B981] text-xl">✓</span>
                      <span>General feedback and testimonials</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#10B981] text-xl">✓</span>
                      <span>Partnership opportunities</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
