import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Snippet from '@/models/Snippet';
import User from '@/models/User';

const FREE_SNIPPET_LIMIT = 5;

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const snippets = await Snippet.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Snippet.countDocuments({ userId: session.user.id });

    return NextResponse.json({
      snippets,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching snippets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch snippets' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Check snippet limit for free users
    if (user.subscription.status === 'free') {
      const snippetCount = await Snippet.countDocuments({ userId: session.user.id });
      if (snippetCount >= FREE_SNIPPET_LIMIT) {
        return new NextResponse(
          'Free plan limit reached. Upgrade to pro for unlimited snippets.',
          { status: 403 }
        );
      }
    }

    const body = await req.json();
    const snippet = await Snippet.create({
      ...body,
      userId: session.user.id,
    });

    return NextResponse.json(snippet);
  } catch (error) {
    console.error('Error creating snippet:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 