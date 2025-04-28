import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import  connectDB  from '@/lib/mongodb';
import Snippet from '@/models/Snippet';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    const {id} = await params;
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();

    const snippet = await Snippet.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!snippet) {
      return new NextResponse('Snippet not found', { status: 404 });
    }

    return NextResponse.json(snippet);
  } catch (error) {
    console.error('Error fetching snippet:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const {id} = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();

    const snippet = await Snippet.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!snippet) {
      return new NextResponse('Snippet not found', { status: 404 });
    }

    const body = await req.json();
    const updatedSnippet = await Snippet.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true }
    );

    return NextResponse.json(updatedSnippet);
  } catch (error) {
    console.error('Error updating snippet:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) { 
  try {
    const {id} = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();

    const snippet = await Snippet.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!snippet) {
      return new NextResponse('Snippet not found', { status: 404 });
    }

    const body = await req.json();
    const updatedSnippet = await Snippet.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true }
    );

    return NextResponse.json(updatedSnippet);
  } catch (error) {
    console.error('Error updating snippet:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const {id} = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();

    const snippet = await Snippet.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!snippet) {
      return new NextResponse('Snippet not found', { status: 404 });
    }

    await Snippet.findByIdAndDelete(params.id);

    return new NextResponse('Snippet deleted', { status: 200 });
  } catch (error) {
    console.error('Error deleting snippet:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 