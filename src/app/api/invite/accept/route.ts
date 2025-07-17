import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { findInvitationByToken, acceptInvitation, addUserToChatRoom } from '@/lib/database';

interface AcceptInvitationRequest {
  token: string;
}

export async function POST(request: NextRequest) {
  try {
    const { token }: AcceptInvitationRequest = await request.json();
    
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find and validate invitation
    const invitation = await findInvitationByToken(token);
    
    if (!invitation) {
      return NextResponse.json({ error: 'Invalid or expired invitation' }, { status: 404 });
    }

    // Verify email matches
    if (invitation.email !== session.user.email) {
      return NextResponse.json({ error: 'Email mismatch' }, { status: 403 });
    }

    // Accept invitation
    await acceptInvitation(token);

    // Add user to chat room if specified
    if (invitation.chatRoomId && session.user.id) {
      await addUserToChatRoom(
        session.user.id,
        session.user.email,
        invitation.chatRoomId,
        invitation.role || 'member'
      );
    }

    return NextResponse.json({ 
      message: 'Invitation accepted successfully!',
      redirectTo: invitation.chatRoomId ? `/chat/${invitation.chatRoomId}` : '/chat'
    });

  } catch (error) {
    console.error('Error accepting invitation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
