export interface Invitation {
    _id?: string;
    email: string;
    token: string;
    invitedBy: string;
    accepted: boolean;
    expiresAt: Date;
    createdAt: Date;
    acceptedAt?: Date;
    chatRoomId?: string;
    role?: 'member' | 'admin' | 'moderator';
  }
  
  export interface InvitationResponse {
    _id: string;
    email: string;
    accepted: boolean;
    expiresAt: string;
    createdAt: string;
    chatRoomId?: string;
    role?: string;
  }
  
  export interface ChatRoomMember {
    userId: string;
    email: string;
    role: 'member' | 'admin' | 'moderator';
    joinedAt: Date;
  }
  