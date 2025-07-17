// lib/invitationToken.ts
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';

const SECRET = process.env.INVITATION_TOKEN_SECRET || 'your-secret-key';

export interface InvitationPayload {
  email: string;
  invitedBy: string;
  chatRoomId?: string;
  role?: string;
}

export const generateInvitationToken = (payload: InvitationPayload): string => {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
};

export const verifyInvitationToken = (token: string): InvitationPayload | null => {
  try {
    return jwt.verify(token, SECRET) as InvitationPayload;
  } catch (error) {
    return null;
  }
};
