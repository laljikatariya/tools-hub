import { NextRequest, NextResponse } from 'next/server';
import { feedbackStorage } from '@/lib/feedback-storage';

// Simple admin authentication check
function isAdminAuthenticated(request: NextRequest): boolean {
  // Check for admin session cookie
  const adminCookie = request.cookies.get('utilo_admin_session')?.value;
  if (!adminCookie) return false;

  try {
    const session = JSON.parse(adminCookie);
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    // Session expires after 1 hour
    if (now - session.timestamp > oneHour) return false;

    // In production, verify against server-side hash
    return true;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  // Check admin authentication
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let filteredFeedback = [...feedbackStorage];

    // Apply filters
    if (type && ['feedback', 'bug', 'suggestion', 'newtool'].includes(type)) {
      filteredFeedback = filteredFeedback.filter(fb => fb.type === type);
    }

    if (status && ['new', 'reviewed', 'resolved'].includes(status)) {
      filteredFeedback = filteredFeedback.filter(fb => fb.status === status);
    }

    // Sort by createdAt descending
    filteredFeedback.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Apply pagination
    const total = filteredFeedback.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFeedback = filteredFeedback.slice(startIndex, endIndex);

    return NextResponse.json({
      feedback: paginatedFeedback,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });

  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  // Check admin authentication
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !['new', 'reviewed', 'resolved'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const feedbackIndex = feedbackStorage.findIndex(fb => fb.id === id);
    if (feedbackIndex === -1) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
      );
    }

    // Update status
    feedbackStorage[feedbackIndex].status = status;

    return NextResponse.json({
      success: true,
      feedback: feedbackStorage[feedbackIndex],
    });

  } catch (error) {
    console.error('Error updating feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}