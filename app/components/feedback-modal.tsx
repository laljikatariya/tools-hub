'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { trackFeedback } from '@/lib/analytics';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'feedback',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Client-side validation
    if (!formData.message || formData.message.length < 10) {
      setErrorMessage('Message is required and must be at least 10 characters');
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
      setIsSubmitting(false);
      return;
    }

    if (!['feedback', 'bug', 'suggestion', 'newtool'].includes(formData.type)) {
      setErrorMessage('Please select a valid feedback type');
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Send feedback to API
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          type: formData.type,
          message: formData.message,
          pageUrl: window.location.href,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to submit feedback' }));
        throw new Error(errorData.error || 'Failed to submit feedback');
      }

      // Also track locally for immediate analytics access
      trackFeedback(
        formData.name,
        formData.email,
        formData.type as 'feedback' | 'bug' | 'suggestion' | 'newtool',
        formData.message,
        window.location.href
      );
      
      setSubmitStatus('success');
      setTimeout(() => {
        setFormData({ name: '', email: '', type: 'feedback', message: '' });
        setSubmitStatus('idle');
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
      setSubmitStatus('error');
      setTimeout(() => {
        setSubmitStatus('idle');
        setErrorMessage('');
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 pt-5" onClick={onClose}>
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </Button>
        
        <CardHeader>
          <CardTitle className="text-2xl">We'd Love Your Feedback! 💬</CardTitle>
          <CardDescription>
            Help us improve Utilo by sharing your thoughts, reporting issues, or suggesting new tools
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {submitStatus === 'success' ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold mb-2 text-green-600 dark:text-green-400">
                Thank You!
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Your feedback has been submitted successfully.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  Name (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  Email (Optional)
                </label>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full"
                />
                <p className="text-xs text-slate-500 mt-1">
                  We'll only use this to follow up if needed
                </p>
              </div>

              {/* Feedback Type */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  What would you like to share? *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'feedback' })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.type === 'feedback'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="text-2xl mb-1">💭</div>
                    <div className="font-medium">Feedback</div>
                    <div className="text-xs text-slate-500">General thoughts</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'bug' })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.type === 'bug'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="text-2xl mb-1">🐛</div>
                    <div className="font-medium">Bug Report</div>
                    <div className="text-xs text-slate-500">Something broken</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'suggestion' })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.type === 'suggestion'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="text-2xl mb-1">💡</div>
                    <div className="font-medium">Suggestion</div>
                    <div className="text-xs text-slate-500">Improvement ideas</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'newtool' })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.type === 'newtool'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="text-2xl mb-1">🔧</div>
                    <div className="font-medium">New Tool</div>
                    <div className="text-xs text-slate-500">Request a tool</div>
                  </button>
                </div>
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  Your Message *
                </label>
                <textarea
                  required
                  placeholder={
                    formData.type === 'feedback'
                      ? 'Share your thoughts about Utilo...'
                      : formData.type === 'bug'
                      ? 'Describe the problem you encountered...'
                      : formData.type === 'suggestion'
                      ? 'Tell us your ideas for improvement...'
                      : 'What tool would you like to see?'
                  }
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full h-32 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Minimum 10 characters
                </p>
              </div>

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                  {errorMessage || 'Something went wrong. Please try again.'}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
