import { Server } from 'socket.io'
import { MsgModel } from '../DAO/mongo/models/msgs.model.js'

export const connectSocket = (httpServer) => {
  const socketServer = new Server(httpServer)

  socketServer.on('connection', (socket) => {
    console.log('cliente socketServer conectado')
    socket.on('disconnect', () => {
      console.log('Un cliente se ha desconectado')
    })

    socket.on('msg_front_to_back', async (msg) => {
      const msgCreated = await MsgModel.create(msg)
      const msgs = await MsgModel.find({})
      socketServer.emit('msg_back_to_front', msgs)
    })
  })
}
