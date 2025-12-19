// In-memory storage for feedback (in production, use a database)
export const feedbackStorage: Array<{
  id: string;
  name: string;
  email: string;
  type: 'feedback' | 'bug' | 'suggestion' | 'newtool';
  message: string;
  pageUrl: string;
  status: 'new' | 'reviewed' | 'resolved';
  createdAt: string;
}> = [];