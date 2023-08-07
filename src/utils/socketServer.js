import { Server } from 'socket.io'
import { chatService } from '../services/chat.services.js'

export const connectSocket = (httpServer) => {
  const socketServer = new Server(httpServer)

  socketServer.on('connection', (socket) => {
    console.log('cliente socketServer conectado')
    socket.on('disconnect', () => {
      console.log('Un cliente se ha desconectado')
    })

    socket.on('msg_front_to_back', async (msg) => {
      const msgCreated = await chatService.addMessage(msg)
      const msgs = await chatService.getAllMessages()
      socketServer.emit('msg_back_to_front', msgs.data)
    })
  })
}
