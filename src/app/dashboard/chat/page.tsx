'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import useChat from '@/hooks/useChat';
import { E_WssChannel, T_WssChannel } from '../../../../ws/src/types/ws.types';

export default function ChatPage() {
  const { data: session } = useSession();
  const { messages, error, isConnected, joinChannel, sendMessage, disconnect } = useChat();
  const [channel, setChannel] = useState<T_WssChannel>('general');
  const [messageInput, setMessageInput] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const handleConnect = () => {
    if (session?.user?.name) {
      joinChannel(channel, session.user.name);
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim() && session?.user?.name) {
      sendMessage(messageInput, session.user.name);
      setMessageInput('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
      {/* Online Users Sidebar */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-sm">Online Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {onlineUsers.map((user) => (
            <div key={user} className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`/avatars/${user}.jpg`} />
                <AvatarFallback>{user[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{user}</span>
              <Badge variant="secondary" className="ml-auto">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Main Chat Area */}
      <div className="lg:col-span-3 space-y-4">
        {/* Connection Controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Label htmlFor="channel">Channel</Label>
                <Select value={channel} onValueChange={(value) => setChannel(value as T_WssChannel)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(E_WssChannel).map((channelKey) => (
                      <SelectItem key={channelKey} value={channelKey}>
                        {E_WssChannel[channelKey as T_WssChannel]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                {isConnected ? (
                  <Button variant="destructive" onClick={disconnect}>
                    Disconnect
                  </Button>
                ) : (
                  <Button onClick={handleConnect}>
                    Connect
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="flex-1">
          <CardContent className="h-96 overflow-y-auto p-4 space-y-2">
            {messages.map((message, index) => (
              <div key={index} className="text-sm">
                {message}
              </div>
            )) || <div className="text-muted-foreground">No messages yet</div>}
          </CardContent>
        </Card>

        {/* Message Input */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex space-x-2">
              <Textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={handleSendMessage} disabled={!isConnected}>
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
