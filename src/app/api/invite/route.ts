import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { createInvitation, findInvitationByEmail } from '@/lib/database';
import { sendInvitationEmail } from '@/lib/emailService';

interface InviteRequest {
  email: string;
  chatRoomId?: string;
  role?: 'member' | 'admin' | 'moderator';
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, chatRoomId, role }: InviteRequest = await request.json();
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const existingInvitation = await findInvitationByEmail(email);
    if (existingInvitation) {
      return NextResponse.json({ error: 'Invitation already sent to this email' }, { status: 400 });
    }

    const invitation = await createInvitation({
      email,
      invitedBy: session.user.id,
      chatRoomId,
      role: role || 'member'
    });

    await sendInvitationEmail(email, invitation.token, session.user.name || session.user.email || 'Someone');

    return NextResponse.json({ 
      message: 'Invitation sent successfully!',
      invitation: {
        _id: invitation._id,
        email: invitation.email,
        createdAt: invitation.createdAt,
        expiresAt: invitation.expiresAt
      }
    });

  } catch (error) {
    console.error('Error sending invitation:', error);
    return NextResponse.json({ error: 'Failed to send invitation' }, { status: 500 });
  }
}
