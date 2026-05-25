import { Server as HTTPServer } from "http"
import { Server as SocketServer } from "socket.io"
import { verifyAccessToken } from "./auth"

let io: SocketServer | null = null

export function getSocketServer() {
  return io
}

export function initSocketServer(httpServer: HTTPServer) {
  if (io) return io

  io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      credentials: true,
    },
  })

  // Auth middleware for socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token as string
    if (!token) return next(new Error("No token"))

    const user = verifyAccessToken(token)
    if (!user) return next(new Error("Invalid token"))

    // Attach user to socket
    socket.data.user = user
    next()
  })

  io.on("connection", (socket) => {
    const user = socket.data.user
    console.log(`Socket connected: ${user.username}`)

    // Join a room per user so we can target them
    socket.join(`user:${user.userId}`)

    socket.on("transaction:add", (transaction) => {
      // Broadcast to all tabs the user has open
      io?.to(`user:${user.userId}`).emit("transaction:added", transaction)
    })

    socket.on("transaction:delete", (id) => {
      io?.to(`user:${user.userId}`).emit("transaction:deleted", id)
    })

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${user.username}`)
    })
  })

  return io
}