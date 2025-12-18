import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for feedback (in production, use a database)
let feedbackStorage: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, feedbackType, message } = body;

    // Validate required fields
    if (!message || message.length < 10) {
      return NextResponse.json(
        { error: 'Message is required and must be at least 10 characters' },
        { status: 400 }
      );
    }

    if (!['feedback', 'bug', 'suggestion', 'newtool'].includes(feedbackType)) {
      return NextResponse.json(
        { error: 'Invalid feedback type' },
        { status: 400 }
      );
    }

    // Create feedback entry
    const feedbackEntry = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name || 'Anonymous',
      email: email || 'Not provided',
      feedbackType,
      message,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || undefined,
    };

    // Store feedback (in production, save to database)
    feedbackStorage.push(feedbackEntry);

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
      id: feedbackEntry.id
    });

  } catch (error) {
    console.error('Error processing feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return all feedback (in production, add authentication)
  return NextResponse.json({
    feedback: feedbackStorage,
    total: feedbackStorage.length
  });
}