"use client"

import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import Cookies from "js-cookie"

export function useSocket() {
  const socketRef              = useRef<Socket | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const token = Cookies.get("access_token")
    if (!token) return

    const socket = io(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000", {
      auth: { token },
      transports: ["websocket", "polling"],
    })

    socketRef.current = socket

    socket.on("connect",    () => setConnected(true))
    socket.on("disconnect", () => setConnected(false))

    return () => {
      socket.disconnect()
    }
  }, [])

  function emit(event: string, data?: unknown) {
    socketRef.current?.emit(event, data)
  }

  function on(event: string, callback: (...args: unknown[]) => void) {
    socketRef.current?.on(event, callback)
    return () => socketRef.current?.off(event, callback)
  }

  return { connected, emit, on, socket: socketRef.current }
}