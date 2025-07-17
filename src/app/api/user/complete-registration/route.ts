import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { handle, token } = await request.json();
    
    if (!handle) {
      return NextResponse.json({ error: 'Handle is required' }, { status: 400 });
    }

    const db = await clientPromise;
    
    // Validate invitation token if provided
    if (token) {
      const invitation = await db.db().collection('invitations').findOne({ 
        token, 
        email: session.user?.email,
        accepted: false,
        expiresAt: { $gt: new Date() }
      });
      if (!invitation) {
        return NextResponse.json({ error: 'Invalid or expired invitation' }, { status: 400 });
      }
      
      // Mark invitation as accepted
      await db.db().collection('invitations').updateOne(
        { _id: invitation._id },
        { $set: { accepted: true } }
      );
    }

    // Check if handle is already taken
    const existingUser = await db.db().collection('users').findOne({ handle });
    if (existingUser) {
      return NextResponse.json({ error: 'Handle already taken' }, { status: 400 });
    }

    // Update user with handle
    const user = await db.db().collection('users').updateOne(
      { email: session.user?.email },
      { $set: { handle } }
    );

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error completing registration:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
