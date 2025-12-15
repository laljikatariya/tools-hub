// Tool usage analytics and tracking
export interface ToolAnalytics {
  toolId: number;
  slug: string;
  views: number;
  searches: number;
  lastUsed: string;
  score: number; // Combined metric for trending
}

export interface FeedbackEntry {
  id: string;
  name: string;
  email: string;
  feedbackType: 'feedback' | 'bug' | 'suggestion' | 'newtool';
  message: string;
  timestamp: string;
  userAgent?: string;
}

export interface AnalyticsData {
  tools: Record<string, ToolAnalytics>;
  searches: Record<string, number>; // Track search terms
  feedback: FeedbackEntry[]; // Track user feedback
  lastUpdated: string;
}

const ANALYTICS_KEY = 'utilo_analytics';
const TRENDING_DECAY_DAYS = 7; // Days before views start to matter less

// Initialize or get analytics data
export function getAnalyticsData(): AnalyticsData {
  if (typeof window === 'undefined') {
    return { tools: {}, searches: {}, feedback: [], lastUpdated: new Date().toISOString() };
  }

  try {
    const stored = localStorage.getItem(ANALYTICS_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // Ensure feedback array exists for backward compatibility
      if (!data.feedback) {
        data.feedback = [];
      }
      return data;
    }
  } catch (error) {
    console.error('Error reading analytics data:', error);
  }

  return { tools: {}, searches: {}, feedback: [], lastUpdated: new Date().toISOString() };
}

// Save analytics data
function saveAnalyticsData(data: AnalyticsData): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving analytics data:', error);
  }
}

// Track tool view
export function trackToolView(toolId: number, slug: string): void {
  const data = getAnalyticsData();
  const now = new Date().toISOString();

  if (!data.tools[slug]) {
    data.tools[slug] = {
      toolId,
      slug,
      views: 0,
      searches: 0,
      lastUsed: now,
      score: 0,
    };
  }

  data.tools[slug].views += 1;
  data.tools[slug].lastUsed = now;
  data.tools[slug].score = calculateTrendingScore(data.tools[slug]);
  data.lastUpdated = now;

  saveAnalyticsData(data);
}

// Track search query
export function trackSearch(query: string, matchedSlugs: string[]): void {
  if (!query.trim()) return;

  const data = getAnalyticsData();
  const normalizedQuery = query.toLowerCase().trim();
  const now = new Date().toISOString();

  // Track the search term
  data.searches[normalizedQuery] = (data.searches[normalizedQuery] || 0) + 1;

  // Increment search count for matched tools
  matchedSlugs.forEach((slug) => {
    if (!data.tools[slug]) {
      data.tools[slug] = {
        toolId: 0, // Will be updated when tool is viewed
        slug,
        views: 0,
        searches: 0,
        lastUsed: now,
        score: 0,
      };
    }

    data.tools[slug].searches += 1;
    data.tools[slug].score = calculateTrendingScore(data.tools[slug]);
  });

  data.lastUpdated = now;
  saveAnalyticsData(data);
}

// Calculate trending score based on views, searches, and recency
function calculateTrendingScore(analytics: ToolAnalytics): number {
  const now = new Date();
  const lastUsed = new Date(analytics.lastUsed);
  const daysSinceUse = (now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60 * 24);
  
  // Decay factor: tools used recently get higher scores
  const decayFactor = Math.max(0.1, 1 - (daysSinceUse / TRENDING_DECAY_DAYS) * 0.5);
  
  // Weighted score: views are worth more than searches
  const baseScore = (analytics.views * 2) + analytics.searches;
  
  return Math.round(baseScore * decayFactor);
}

// Get trending tools
export function getTrendingTools(limit: number = 10): ToolAnalytics[] {
  const data = getAnalyticsData();
  
  return Object.values(data.tools)
    .filter(tool => tool.views > 0 || tool.searches > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// Get analytics for a specific tool
export function getToolAnalytics(slug: string): ToolAnalytics | null {
  const data = getAnalyticsData();
  return data.tools[slug] || null;
}

// Get popular search terms
export function getPopularSearches(limit: number = 10): Array<{ term: string; count: number }> {
  const data = getAnalyticsData();
  
  return Object.entries(data.searches)
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// Clear analytics data (for testing or reset)
export function clearAnalytics(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(ANALYTICS_KEY);
  } catch (error) {
    console.error('Error clearing analytics data:', error);
  }
}

// Export analytics data (for backup or analysis)
export function exportAnalytics(): string {
  const data = getAnalyticsData();
  return JSON.stringify(data, null, 2);
}

// Track feedback submission
export function trackFeedback(
  name: string,
  email: string,
  feedbackType: 'feedback' | 'bug' | 'suggestion' | 'newtool',
  message: string
): void {
  if (typeof window === 'undefined') return;

  const data = getAnalyticsData();
  const now = new Date().toISOString();

  const feedbackEntry: FeedbackEntry = {
    id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: name || 'Anonymous',
    email: email || 'Not provided',
    feedbackType,
    message,
    timestamp: now,
    userAgent: navigator.userAgent,
  };

  data.feedback.push(feedbackEntry);
  data.lastUpdated = now;

  saveAnalyticsData(data);
}

// Get all feedback entries
export function getAllFeedback(): FeedbackEntry[] {
  const data = getAnalyticsData();
  return data.feedback.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

// Get feedback by type
export function getFeedbackByType(type: 'feedback' | 'bug' | 'suggestion' | 'newtool'): FeedbackEntry[] {
  const data = getAnalyticsData();
  return data.feedback
    .filter(fb => fb.feedbackType === type)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Get feedback statistics
export function getFeedbackStats() {
  const data = getAnalyticsData();
  const feedback = data.feedback;

  return {
    total: feedback.length,
    feedback: feedback.filter(fb => fb.feedbackType === 'feedback').length,
    bugs: feedback.filter(fb => fb.feedbackType === 'bug').length,
    suggestions: feedback.filter(fb => fb.feedbackType === 'suggestion').length,
    newTools: feedback.filter(fb => fb.feedbackType === 'newtool').length,
  };
}

// Contact page analytics interfaces and functions
export interface ContactFormSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  messageLength: number;
  timestamp: string;
  userAgent?: string;
}

export interface ContactPageAnalytics {
  pageViews: number;
  formSubmissions: ContactFormSubmission[];
  subjectDistribution: Record<string, number>;
  interactions: Record<string, number>;
  lastUpdated: string;
}

const CONTACT_ANALYTICS_KEY = 'utilo_contact_analytics';

// Initialize or get contact analytics data
function getContactAnalyticsData(): ContactPageAnalytics {
  if (typeof window === 'undefined') {
    return {
      pageViews: 0,
      formSubmissions: [],
      subjectDistribution: {},
      interactions: {},
      lastUpdated: new Date().toISOString(),
    };
  }

  try {
    const stored = localStorage.getItem(CONTACT_ANALYTICS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading contact analytics data:', error);
  }

  return {
    pageViews: 0,
    formSubmissions: [],
    subjectDistribution: {},
    interactions: {},
    lastUpdated: new Date().toISOString(),
  };
}

// Save contact analytics data
function saveContactAnalyticsData(data: ContactPageAnalytics): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(CONTACT_ANALYTICS_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving contact analytics data:', error);
  }
}

// Track contact page view
export function trackContactPageView(): void {
  const data = getContactAnalyticsData();
  data.pageViews += 1;
  data.lastUpdated = new Date().toISOString();
  saveContactAnalyticsData(data);
}

// Track contact form submission
export function trackContactFormSubmission(
  name: string,
  email: string,
  subject: string,
  message: string
): void {
  if (typeof window === 'undefined') return;

  const data = getContactAnalyticsData();
  const now = new Date().toISOString();

  const submission: ContactFormSubmission = {
    id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    email,
    subject,
    message,
    messageLength: message.length,
    timestamp: now,
    userAgent: navigator.userAgent,
  };

  data.formSubmissions.push(submission);
  
  // Update subject distribution
  data.subjectDistribution[subject] = (data.subjectDistribution[subject] || 0) + 1;
  
  data.lastUpdated = now;
  saveContactAnalyticsData(data);
}

// Track contact form interactions (field focus, subject selection, etc.)
export function trackContactFormInteraction(interactionType: string, value?: string): void {
  const data = getContactAnalyticsData();
  const key = value ? `${interactionType}_${value}` : interactionType;
  data.interactions[key] = (data.interactions[key] || 0) + 1;
  data.lastUpdated = new Date().toISOString();
  saveContactAnalyticsData(data);
}

// Get contact page analytics
export function getContactPageAnalytics(): ContactPageAnalytics {
  return getContactAnalyticsData();
}

// Get contact form submission statistics
export function getContactFormStats() {
  const data = getContactAnalyticsData();
  
  const totalSubmissions = data.formSubmissions.length;
  const averageMessageLength = totalSubmissions > 0
    ? Math.round(data.formSubmissions.reduce((sum, s) => sum + s.messageLength, 0) / totalSubmissions)
    : 0;

  // Get submissions from last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentSubmissions = data.formSubmissions.filter(
    s => new Date(s.timestamp) >= thirtyDaysAgo
  ).length;

  return {
    pageViews: data.pageViews,
    totalSubmissions,
    recentSubmissions,
    averageMessageLength,
    conversionRate: data.pageViews > 0 
      ? ((totalSubmissions / data.pageViews) * 100).toFixed(2) + '%'
      : '0%',
    subjectDistribution: data.subjectDistribution,
    topSubjects: Object.entries(data.subjectDistribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([subject, count]) => ({ subject, count })),
  };
}
