# Next.js Real-Time Chat Application 💬

This is a Next.js project bootstrapped with create-next-app, featuring real-time chat functionality powered by Socket.IO. A modern, scalable chat application with multiple channels, user validation, and persistent message history.

---

## 🚀 Features

- **Real-time messaging with Socket.IO**
- **Multiple chat channels** (General Discussion, Tech Talk, Random)
- **User handle validation and registration system**
- **Persistent chat history using file-based storage**
- **Auto-reconnection with connection status indicators**
- **Responsive design with DaisyUI components**
- **TypeScript for complete type safety**
- **File watching for real-time message broadcasting**
- **User join/leave notifications**
- **Message history loaded on channel join**
- **Keyboard shortcuts** (Enter to send, Shift+Enter for new line)

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library with hooks
- **TypeScript** - Type safety and better DX
- **Socket.IO Client** - Real-time communication
- **DaisyUI** - Beautiful UI components
- **Tailwind CSS** - Utility-first styling
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Socket.IO** - WebSocket communication server
- **TypeScript** - Type safety on backend
- **File System API** - Chat persistence
- **Day.js** - Lightweight date formatting

### Development Tools
- **Concurrently** - Run multiple scripts simultaneously
- **Nodemon** - Auto-restart server on changes
- **ESLint** - Code linting and formatting
- **PostCSS & Autoprefixer** - CSS processing

---

## 📁 Project Structure

```text
nextjs-chatapp-example/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main chat interface component
│   │   ├── layout.tsx            # Root layout with metadata
│   │   └── globals.css           # Global styles and Tailwind imports
│   └── hooks/
│       └── useChat.ts            # Custom hook for Socket.IO integration
├── ws/
│   ├── src/
│   │   ├── server.ts             # Socket.IO server implementation
│   │   ├── WsHelper.ts           # WebSocket utility functions
│   │   └── types/
│   │       └── ws.types.ts       # TypeScript definitions for WebSocket
│   ├── dist/                     # Compiled JavaScript output
│   └── data/                     # Chat logs and user registration files
├── public/                       # Static assets
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # Next.js TypeScript configuration
├── tsconfig.ws.json              # WebSocket server TypeScript config
├── tailwind.config.ts            # Tailwind CSS configuration
├── next.config.mjs               # Next.js configuration
├── postcss.config.js             # PostCSS configuration
├── .env.local                    # Environment variables (create this)
├── .gitignore                    # Git ignore rules
└── README.md                     # This file
```

---

## 🚀 Installation

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun

### Clone the Repository

```bash
git clone https://github.com/designly1/nextjs-chatapp-example.git
cd nextjs-chatapp-example
```

### Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Environment Setup
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_WSS_URL=http://localhost:1337
```

---

## 🏃‍♂️ Getting Started

### Development Mode (Recommended)
Run both frontend and backend simultaneously:

```bash
npm run dev-all
# or
yarn dev-all
# or
pnpm dev-all
```

This will start:
- Next.js development server on [http://localhost:3000](http://localhost:3000)
- Socket.IO server on [http://localhost:1337](http://localhost:1337)

### Run Servers Separately
- **Terminal 1 - Frontend:**
  ```bash
  npm run dev
  # or
yarn dev
# or
pnpm dev
  ```
- **Terminal 2 - Backend:**
  ```bash
  npm run dev-ws
  # or
yarn dev-ws
# or
pnpm dev-ws
  ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the chat application.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file. The WebSocket server code is located in `ws/src/server.ts`.

---

## 📝 Usage

### Basic Chat Flow
1. Start the application using `npm run dev-all`
2. Open your browser to [http://localhost:3000](http://localhost:3000)
3. Select a channel from the dropdown (General Discussion, Tech Talk, Random)
4. Enter your handle (3-16 characters, letters, numbers, underscores only)
5. Click Connect to join the chat room
6. Start chatting in real-time!

### User Handle Rules
- Must be 3-16 characters long
- Only letters, numbers, and underscores allowed
- Automatically formatted with first letter capitalized
- Must be unique per channel

### Keyboard Shortcuts
- **Enter:** Send message
- **Shift + Enter:** New line in message

### Available Channels
- **General Discussion** - Main chat room for general conversations
- **Tech Talk** - Technology-focused discussions
- **Random** - Off-topic and casual conversations

---

## 🔧 API Documentation

### Socket.IO Events

#### Client → Server Events
| Event         | Data                                      | Description                      |
|---------------|-------------------------------------------|----------------------------------|
| join-channel  | { channel: string, handle: string }       | Join a specific chat channel     |
| chat-message  | { handle: string, message: string, type: 'chat' } | Send a chat message             |
| disconnect    | -                                         | Disconnect from server           |

#### Server → Client Events
| Event           | Data                                   | Description                      |
|-----------------|----------------------------------------|----------------------------------|
| connect         | -                                      | Successfully connected to server |
| disconnect      | -                                      | Disconnected from server         |
| chat-message    | { channel: string, message: string }    | Receive a chat message           |
| joined-channel  | { channel: string, handle: string }     | Successfully joined channel      |
| error           | { message: string }                     | Error occurred during operation  |

### WebSocket Connection Flow
1. Client connects to `http://localhost:1337`
2. Client emits `join-channel` with channel and handle
3. Server validates and registers user
4. Server sends chat history to client
5. Client receives real-time messages via `chat-message` events
6. Client can send messages via `chat-message` events

---

## 🏗️ Development Workflow

### Available Scripts
| Script              | Description                                 |
|---------------------|---------------------------------------------|
| npm run dev         | Start Next.js development server only       |
| npm run dev-ws      | Start Socket.IO server with TypeScript compilation and auto-reload |
| npm run dev-all     | Start both servers concurrently (recommended) |
| npm run build       | Build Next.js application for production    |
| npm run build-ws    | Compile WebSocket server TypeScript to JavaScript |
| npm start           | Start production Next.js server             |
| npm run start-ws    | Start production WebSocket server           |
| npm run lint        | Run ESLint for code quality                 |

### Development Tips
- **Hot Reload:** Both servers support hot reload during development
- **TypeScript:** Full TypeScript support for both frontend and backend
- **Logging:** Server logs all connections, messages, and errors
- **File Structure:** Keep components in `src/`, server code in `ws/src/`

---

## 🐛 Troubleshooting

### Common Issues

#### WebSocket Connection Failed
```bash
# Ensure both servers are running
npm run dev-all

# Check if port 1337 is available
lsof -i :1337

# Verify environment variables
cat .env.local
```

#### TypeScript Compilation Errors
```bash
# Check server compilation
npm run build-ws

# Check for missing dependencies
npm install

# Verify TypeScript configurations
npx tsc --showConfig
```

#### Messages Not Appearing
- Check browser console for WebSocket errors
- Verify connection status in UI
- Ensure proper event handling in components
- Check server logs for message processing

#### Build Errors
```bash
# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npx tsc --noEmit
```

#### Debug Mode
Enable debug logging by setting environment variables:
```bash
DEBUG=socket.io* npm run dev-ws
```

---

## 🚀 Production Deployment

### Build for Production
```bash
# Build WebSocket server
npm run build-ws

# Build Next.js application
npm run build
```

### Start Production Servers
```bash
# Start WebSocket server
npm run start-ws

# Start Next.js server (in another terminal)
npm start
```

### Deploy on Vercel
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/) from the creators of Next.js.

**Important:** You'll need to deploy the Socket.IO server separately:
- Use services like [Railway](https://railway.app/), [Render](https://render.com/), or [Heroku](https://heroku.com/) for the WebSocket server
- Update `NEXT_PUBLIC_WSS_URL` to point to your deployed server
- Ensure CORS is properly configured for production

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Add proper error handling
- Include comments for complex logic
- Test both frontend and backend changes
- Update documentation for new features

---

## 📚 Learn More
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Socket.IO Documentation](https://socket.io/docs/) - learn about real-time communication
- [DaisyUI Documentation](https://daisyui.com/) - learn about the UI components used
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - learn about TypeScript
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - learn about utility-first styling
- [Next.js GitHub Repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

---

## 🔮 Future Enhancements
- User authentication system
- Private messaging between users
- File sharing capabilities
- Emoji reactions to messages
- Typing indicators
- Message search functionality
- User avatars and profiles
- Message encryption
- Database integration (PostgreSQL/MongoDB)
- Mobile app version
- Voice/video chat integration
- Message threading
- Admin moderation tools

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Socket.IO](https://socket.io/) for seamless real-time communication
- [DaisyUI](https://daisyui.com/) for beautiful, accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Vercel](https://vercel.com/) for excellent deployment platform

Built with ❤️ using Next.js and Socket.IO

For questions, issues, or contributions, please visit our [GitHub repository](https://github.com/ridhamxdev).




