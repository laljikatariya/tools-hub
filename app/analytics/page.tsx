'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getTrendingTools, getPopularSearches, clearAnalytics, exportAnalytics, getAllFeedback, getContactFormStats, getContactPageAnalytics } from '@/lib/analytics';
import { toolsData } from '@/lib/tools-data';
import { isAdminAuthenticated, authenticateAdmin, logoutAdmin } from '@/lib/admin-auth';
import { TrendingUp, Search, Eye, Download, Trash2, Lock, LogOut, MessageSquare, Bug, Lightbulb, Wrench } from 'lucide-react';

export default function AnalyticsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [trendingTools, setTrendingTools] = useState<any[]>([]);
  const [popularSearches, setPopularSearches] = useState<any[]>([]);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [feedbackStats, setFeedbackStats] = useState<any>(null);
  const [contactStats, setContactStats] = useState<any>(null);
  const [contactSubmissions, setContactSubmissions] = useState<any[]>([]);
  const [timeFilter, setTimeFilter] = useState<'all' | 'day' | 'week' | 'month' | 'year'>('all');

  // Check authentication on mount
  useEffect(() => {
    setIsAuthenticated(isAdminAuthenticated());
  }, []);

  // Filter data by time range
  const filterDataByTime = (data: any[], dateField: string = 'lastUsed') => {
    if (timeFilter === 'all') return data;

    const now = new Date();
    const cutoffDate = new Date();

    switch (timeFilter) {
      case 'day':
        cutoffDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return data.filter(item => {
      const itemDate = new Date(item[dateField] || item.timestamp);
      return itemDate >= cutoffDate;
    });
  };

  const loadAnalytics = () => {
    const trending = getTrendingTools(15);
    const searches = getPopularSearches(10);
    const feedback = getAllFeedback();
    const contactFormStats = getContactFormStats();
    const contactData = getContactPageAnalytics();

    // Apply time filters
    const filteredTrending = filterDataByTime(trending);
    const filteredFeedback = filterDataByTime(feedback, 'timestamp');
    const filteredContactSubmissions = filterDataByTime(contactData.formSubmissions, 'timestamp');

    // Enrich trending tools with tool data
    const enrichedTrending = filteredTrending.map(analytics => {
      const tool = toolsData.find(t => t.slug === analytics.slug);
      return { ...analytics, tool };
    });

    // Calculate filtered stats
    const filteredStats = {
      total: filteredFeedback.length,
      feedback: filteredFeedback.filter(fb => fb.feedbackType === 'feedback').length,
      bugs: filteredFeedback.filter(fb => fb.feedbackType === 'bug').length,
      suggestions: filteredFeedback.filter(fb => fb.feedbackType === 'suggestion').length,
      newTools: filteredFeedback.filter(fb => fb.feedbackType === 'newtool').length,
    };

    setTrendingTools(enrichedTrending);
    setPopularSearches(searches);
    setFeedbackList(filteredFeedback);
    setFeedbackStats(filteredStats);
    setContactStats(contactFormStats);
    setContactSubmissions(filteredContactSubmissions);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAnalytics();
    }
  }, [isAuthenticated, timeFilter]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authenticateAdmin(password)) {
      setIsAuthenticated(true);
      setError('');
      setPassword('');
    } else {
      setError('Invalid password');
      setPassword('');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
    setTrendingTools([]);
    setPopularSearches([]);
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <div className="sticky top-0 z-50 border-b border-[#E5E7EB] dark:border-[#1E293B] bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-center h-20">
              <Link href="/" className="flex items-center gap-3 group">
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200">🧰</span>
                <span className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB]">Utilo</span>
              </Link>
            </div>
          </div>
        </div>
        <main className="min-h-screen bg-gradient-to-b from-slate-50 dark:from-slate-900 to-white dark:to-slate-950">
          <div className="max-w-md mx-auto px-4 py-20">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                    <Lock className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Admin Access Required</CardTitle>
                <CardDescription>
                  Enter the admin password to view analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Input
                      type="password"
                      placeholder="Enter admin password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full"
                      autoFocus
                    />
                    {error && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                        {error}
                      </p>
                    )}
                  </div>
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </>
    );
  }

  const handleClearAnalytics = () => {
    if (window.confirm('Are you sure you want to clear all analytics data? This cannot be undone.')) {
      clearAnalytics();
      loadAnalytics();
      alert('Analytics data cleared successfully!');
    }
  };

  const handleExportAnalytics = () => {
    const data = exportAnalytics();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `utilo-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totalViews = trendingTools.reduce((sum, t) => sum + t.views, 0);
  const totalSearches = popularSearches.reduce((sum, s) => sum + s.count, 0);

  return (
    <>
      <div className="sticky top-0 z-50 border-b border-[#E5E7EB] dark:border-[#1E293B] bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-center h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <span className="text-3xl group-hover:scale-110 transition-transform duration-200">🧰</span>
              <span className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB]">Utilo</span>
            </Link>
          </div>
        </div>
      </div>
      <main className="min-h-screen bg-gradient-to-b from-slate-50 dark:from-slate-900 to-white dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-4xl font-bold mb-2">📊 Analytics Dashboard</h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Track usage patterns and trending tools on Utilo
                </p>
              </div>
              <Button onClick={handleLogout} variant="secondary">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
            {timeFilter !== 'all' && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                📅 Showing data from: {
                  timeFilter === 'day' ? 'Last 24 Hours' :
                  timeFilter === 'week' ? 'Last 7 Days' :
                  timeFilter === 'month' ? 'Last Month' :
                  'Last Year'
                }
              </div>
            )}
          </div>

          {/* Time Filter */}
          <div className="mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mr-2">
                    Time Range:
                  </span>
                  <Button
                    variant={timeFilter === 'all' ? 'default' : 'secondary'}
                    size="sm"
                    onClick={() => setTimeFilter('all')}
                  >
                    All Time
                  </Button>
                  <Button
                    variant={timeFilter === 'day' ? 'default' : 'secondary'}
                    size="sm"
                    onClick={() => setTimeFilter('day')}
                  >
                    Last 24 Hours
                  </Button>
                  <Button
                    variant={timeFilter === 'week' ? 'default' : 'secondary'}
                    size="sm"
                    onClick={() => setTimeFilter('week')}
                  >
                    Last 7 Days
                  </Button>
                  <Button
                    variant={timeFilter === 'month' ? 'default' : 'secondary'}
                    size="sm"
                    onClick={() => setTimeFilter('month')}
                  >
                    Last Month
                  </Button>
                  <Button
                    variant={timeFilter === 'year' ? 'default' : 'secondary'}
                    size="sm"
                    onClick={() => setTimeFilter('year')}
                  >
                    Last Year
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{toolsData.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{totalViews}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Searches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{totalSearches}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Active Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {trendingTools.filter(t => t.views > 0).length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {feedbackStats?.total || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feedback Stats */}
          {feedbackStats && feedbackStats.total > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <div>
                      <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {feedbackStats.feedback}
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">General Feedback</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Bug className="w-8 h-8 text-red-600 dark:text-red-400" />
                    <div>
                      <div className="text-2xl font-bold text-red-900 dark:text-red-100">
                        {feedbackStats.bugs}
                      </div>
                      <div className="text-sm text-red-700 dark:text-red-300">Bug Reports</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                    <div>
                      <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                        {feedbackStats.suggestions}
                      </div>
                      <div className="text-sm text-yellow-700 dark:text-yellow-300">Suggestions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Wrench className="w-8 h-8 text-green-600 dark:text-green-400" />
                    <div>
                      <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                        {feedbackStats.newTools}
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300">Tool Requests</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Contact Page Analytics */}
          {contactStats && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ✉️ Contact Page Analytics
                </CardTitle>
                <CardDescription>Track contact form submissions and user engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Page Views</div>
                    <div className="text-2xl font-bold">{contactStats.pageViews}</div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Submissions</div>
                    <div className="text-2xl font-bold text-blue-600">{contactStats.totalSubmissions}</div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Recent (30d)</div>
                    <div className="text-2xl font-bold text-green-600">{contactStats.recentSubmissions}</div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Conversion Rate</div>
                    <div className="text-2xl font-bold text-purple-600">{contactStats.conversionRate}</div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Avg Message Length</div>
                    <div className="text-2xl font-bold text-orange-600">{contactStats.averageMessageLength}</div>
                  </div>
                </div>

                {contactStats.topSubjects && contactStats.topSubjects.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Top Contact Subjects</h3>
                    <div className="space-y-2">
                      {contactStats.topSubjects.map((subject: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <span className="capitalize">{subject.subject.replace('-', ' ')}</span>
                          <span className="font-semibold text-indigo-600 dark:text-indigo-400">{subject.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Form Submissions */}
                {contactSubmissions && contactSubmissions.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Contact Form Submissions ({contactSubmissions.length})
                    </h3>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      {contactSubmissions.map((submission) => {
                        const subjectConfig: Record<string, { color: string; icon: string }> = {
                          'general': { color: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300', icon: '💬' },
                          'bug': { color: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300', icon: '🐛' },
                          'feature': { color: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300', icon: '✨' },
                          'tool': { color: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300', icon: '🔧' },
                          'feedback': { color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300', icon: '💡' },
                          'business': { color: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300', icon: '💼' },
                          'other': { color: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300', icon: '📝' },
                        };

                        const config = subjectConfig[submission.subject] || subjectConfig['other'];

                        return (
                          <div
                            key={submission.id}
                            className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3 flex-wrap">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                                  {config.icon} {submission.subject.charAt(0).toUpperCase() + submission.subject.slice(1)}
                                </span>
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                  {new Date(submission.timestamp).toLocaleString()}
                                </div>
                              </div>
                            </div>
                            
                            <div className="mb-3 space-y-2">
                              <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                  <span className="font-semibold">👤 Name:</span>
                                  <span>{submission.name}</span>
                                </span>
                                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                  <span className="font-semibold">✉️ Email:</span>
                                  <span>{submission.email}</span>
                                </span>
                              </div>
                              
                              <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">MESSAGE:</div>
                                <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                                  {submission.message}
                                </p>
                                <div className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                                  Length: {submission.messageLength} characters
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-4 mb-8">
            <Button onClick={handleExportAnalytics} variant="secondary">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button onClick={handleClearAnalytics} variant="secondary" className="text-red-600 hover:text-red-700">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Analytics
            </Button>
          </div>

          {/* User Feedback Section */}
          {feedbackList && feedbackList.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  User Feedback ({feedbackList.length})
                </CardTitle>
                <CardDescription>Recent feedback, bug reports, and suggestions from users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {feedbackList.map((feedback) => {
                    const typeConfig = {
                      feedback: { icon: '💭', color: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300', label: 'Feedback' },
                      bug: { icon: '🐛', color: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300', label: 'Bug Report' },
                      suggestion: { icon: '💡', color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300', label: 'Suggestion' },
                      newtool: { icon: '🔧', color: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300', label: 'Tool Request' },
                    };

                    const config = typeConfig[feedback.feedbackType as keyof typeof typeConfig];

                    return (
                      <div
                        key={feedback.id}
                        className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                              {config.icon} {config.label}
                            </span>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              {new Date(feedback.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                            {feedback.message}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                          {feedback.name && feedback.name !== 'Anonymous' && (
                            <span className="flex items-center gap-1">
                              👤 <span className="font-medium">{feedback.name}</span>
                            </span>
                          )}
                          {feedback.email && feedback.email !== 'Not provided' && (
                            <span className="flex items-center gap-1">
                              ✉️ <span className="font-medium">{feedback.email}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Trending Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Trending Tools
                </CardTitle>
                <CardDescription>Most used and searched tools</CardDescription>
              </CardHeader>
              <CardContent>
                {trendingTools.length > 0 ? (
                  <div className="space-y-4">
                    {trendingTools.map((item, index) => (
                      <div
                        key={item.slug}
                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            {item.tool ? (
                              <>
                                <div className="font-semibold flex items-center gap-2">
                                  <span>{item.tool.icon}</span>
                                  <span>{item.tool.name}</span>
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400 flex gap-4 mt-1">
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    {item.views} views
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Search className="w-3 h-3" />
                                    {item.searches} searches
                                  </span>
                                </div>
                              </>
                            ) : (
                              <div className="font-semibold text-slate-500">
                                {item.slug}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-orange-600">
                              Score: {item.score}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <p className="mb-2">No usage data yet</p>
                    <p className="text-sm">Start using tools to see analytics here!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Popular Searches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Popular Searches
                </CardTitle>
                <CardDescription>Most frequently searched terms</CardDescription>
              </CardHeader>
              <CardContent>
                {popularSearches.length > 0 ? (
                  <div className="space-y-3">
                    {popularSearches.map((item, index) => (
                      <div
                        key={item.term}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 font-semibold text-xs">
                            {index + 1}
                          </div>
                          <div className="font-medium">{item.term}</div>
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {item.count} {item.count === 1 ? 'search' : 'searches'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <p className="mb-2">No search data yet</p>
                    <p className="text-sm">Search for tools to see popular terms here!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
