import { Server } from 'socket.io';
import { createServer } from 'http';
import fs from 'fs';
import url from 'url';
import path from 'path';
import dayjs from 'dayjs';
import WsHelper from './WsHelper';

// Keep your existing types
import { T_WssChannel, E_WssChannel, I_WssChatRequest } from './types/ws.types';

// Keep your existing constants
const CHANNELS = Object.keys(E_WssChannel);
const DATA_DIR = path.join(__dirname, '../data');
const REGISTERED_USERS_FILE = path.join(DATA_DIR, 'registered_users.log');
const LISTEN_PORT = 1337;
const SYSTEM_USER = 'System';

// Create HTTP server for Socket.IO
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const getTimestemp = () => {
  return dayjs().format('YYYY-MM-DD HH:mm:ss');
};

const makeLinePrefix = (handle: string) => {
  return `[${getTimestemp()}] ${handle}: `;
};

// Initialize data directory
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// Clear registered users file on server start
if (!fs.existsSync(REGISTERED_USERS_FILE)) {
  fs.writeFileSync(REGISTERED_USERS_FILE, '', 'utf8');
} else {
  fs.truncateSync(REGISTERED_USERS_FILE, 0);
}

console.log(`Socket.IO server listening on port ${LISTEN_PORT}`);

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Handle channel joining
  socket.on('join-channel', async (data: { channel: T_WssChannel; handle: string }) => {
    const { channel, handle } = data;

    // Validate channel
    if (!channel || !CHANNELS.includes(channel)) {
      WsHelper.error(socket, 'No valid channel provided');
      return;
    }

    if (!handle) {
      WsHelper.error(socket, 'No valid handle provided');
      return;
    }

    // Check if user is already registered
    const registeredUsers = fs.readFileSync(REGISTERED_USERS_FILE, 'utf8');
    const searchTerm = `${handle}|${channel}`;
    
    if (registeredUsers.includes(searchTerm)) {
      WsHelper.error(socket, 'User already registered');
      return;
    }

    // Store user data in socket
    socket.data.handle = handle;
    socket.data.channel = channel;

    // Join Socket.IO room
    socket.join(channel);

    // Register user
    fs.appendFileSync(REGISTERED_USERS_FILE, `${handle}|${channel}\n`);

    // Create log file if needed
    const logFile = path.join(DATA_DIR, `channel_${channel}.log`);
    if (!fs.existsSync(logFile)) {
      fs.writeFileSync(logFile, '', 'utf8');
    }

    // Send chat history
    const chatHistory = fs.readFileSync(logFile, 'utf8');
    if (chatHistory) {
      const messages = chatHistory.split('\n').filter(msg => msg.trim());
      messages.forEach(message => {
        WsHelper.chat(socket, { channel, message });
      });
    }

    // Notify room of new user
    const joinMessage = `${makeLinePrefix(SYSTEM_USER)} ${handle} has joined the chat\n`;
    fs.appendFileSync(logFile, joinMessage);
    io.to(channel).emit('chat-message', { channel, message: joinMessage.trim() });

    // Set up file watching for this user
    let lastSize = fs.statSync(logFile).size;
    const watcher = fs.watch(logFile, (eventType) => {
      if (eventType === 'change') {
        const stats = fs.statSync(logFile);
        if (stats.size > lastSize) {
          const stream = fs.createReadStream(logFile, {
            start: lastSize,
            end: stats.size,
          });

          stream.on('data', (newData: string | Buffer) => {
            const message = newData.toString();
            WsHelper.chat(socket, { channel, message: message.trim() });
          });

          lastSize = stats.size;
        }
      }
    });

    socket.data.watcher = watcher;
    socket.emit('joined-channel', { channel, handle });
    console.log(`Client connected to channel: ${E_WssChannel[channel]}`);
  });

  // Handle chat messages
  socket.on('chat-message', (data: I_WssChatRequest) => {
    const { handle, message, type } = data;
    const { channel } = socket.data;

    if (!handle || !message || !type || !channel) {
      WsHelper.error(socket, 'Invalid payload');
      return;
    }

    console.log(`Received: [${type}] message from ${handle}`);

    switch (type) {
      case 'chat':
        const logFile = path.join(DATA_DIR, `channel_${channel}.log`);
        fs.appendFileSync(logFile, `${makeLinePrefix(handle)} ${message}\n`);
        break;
      case 'system':
        if (message === 'keepalive') {
          console.log('Received keepalive message');
        }
        break;
      default:
        console.error('Invalid message type:', type);
        break;
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const { handle, channel, watcher } = socket.data || {};

    if (handle && channel) {
      // Notify room of user leaving
      const logFile = path.join(DATA_DIR, `channel_${channel}.log`);
      const leaveMessage = `${makeLinePrefix(SYSTEM_USER)} ${handle} has left the chat\n`;
      fs.appendFileSync(logFile, leaveMessage);

      // Remove user from registered users
      const registeredUsers = fs.readFileSync(REGISTERED_USERS_FILE, 'utf8');
      const searchTerm = `${handle}|${channel}`;
      const newUsers = registeredUsers.split('\n').filter(user => user !== searchTerm);
      fs.writeFileSync(REGISTERED_USERS_FILE, newUsers.join('\n'));

      // Clean up file watcher
      if (watcher) {
        watcher.close();
      }
    }

    console.log(`Client disconnected: ${socket.id}`);
  });
});

httpServer.listen(LISTEN_PORT, () => {
  console.log(`Socket.IO server listening on port ${LISTEN_PORT}`);
});
