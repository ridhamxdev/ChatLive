export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getInvitations } from '@/lib/database';
import { InvitationResponse } from '@/types/invitation';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const invitations = await getInvitations(session.user.id);
    
    const formattedInvitations: InvitationResponse[] = invitations.map(invitation => ({
      _id: invitation._id?.toString() || '',
      email: invitation.email,
      accepted: invitation.accepted,
      expiresAt: invitation.expiresAt.toISOString(),
      createdAt: invitation.createdAt.toISOString(),
      chatRoomId: invitation.chatRoomId,
      role: invitation.role
    }));

    return NextResponse.json({ invitations: formattedInvitations });
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
