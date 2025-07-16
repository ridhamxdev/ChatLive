import { Socket } from 'socket.io';

class WsHelper {
  static error(socket: Socket, message: string, disconnect = false) {
    socket.emit('error', { message });
    if (disconnect) {
      socket.disconnect();
    }
  }

  static chat(socket: Socket, data: { channel: string; message: string }) {
    socket.emit('chat-message', data);
  }
}

export default WsHelper;
