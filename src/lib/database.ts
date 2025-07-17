import { ObjectId } from 'mongodb';
import clientPromise from './mongodb';
import { nanoid } from 'nanoid';
import { Invitation, ChatRoomMember } from '@/types/invitation';

export async function createInvitation(invitationData: {
  email: string;
  invitedBy: string;
  chatRoomId?: string;
  role?: 'member' | 'admin' | 'moderator';
}): Promise<Invitation> {
  const client = await clientPromise;
  const db = client.db('chatDatabase');
  
  const invitation: Omit<Invitation, '_id'> = {
    ...invitationData,
    token: nanoid(32),
    accepted: false,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };
  
  const result = await db.collection<Invitation>('invitations').insertOne(invitation);
  return { ...invitation, _id: result.insertedId.toString() };
}

export async function getInvitations(userId: string): Promise<Invitation[]> {
  const client = await clientPromise;
  const db = client.db('chatDatabase');
  
  return await db.collection<Invitation>('invitations')
    .find({ invitedBy: userId })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function findInvitationByToken(token: string): Promise<Invitation | null> {
  const client = await clientPromise;
  const db = client.db('chatDatabase');
  
  return await db.collection<Invitation>('invitations').findOne({
    token,
    accepted: false,
    expiresAt: { $gt: new Date() }
  });
}

export async function findInvitationByEmail(email: string): Promise<Invitation | null> {
  const client = await clientPromise;
  const db = client.db('chatDatabase');
  
  return await db.collection<Invitation>('invitations').findOne({
    email,
    accepted: false,
    expiresAt: { $gt: new Date() }
  });
}

export async function acceptInvitation(token: string): Promise<void> {
  const client = await clientPromise;
  const db = client.db('chatDatabase');
  
  await db.collection<Invitation>('invitations').updateOne(
    { token },
    { $set: { accepted: true, acceptedAt: new Date() } }
  );
}

export async function addUserToChatRoom(
  userId: string, 
  email: string, 
  chatRoomId: string, 
  role: 'member' | 'admin' | 'moderator' = 'member'
): Promise<void> {
  const client = await clientPromise;
  const db = client.db('chatDatabase');
  
  const member: ChatRoomMember = {
    userId,
    email,
    role,
    joinedAt: new Date(),
  };
  
  await db.collection('chatRooms').updateOne(
    { _id: new ObjectId(chatRoomId) },
    { $addToSet: { members: member } }
  );
}
