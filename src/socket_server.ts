import { Server } from "socket.io"
import http from "http"
import echoHandler from "./socket/echoHandler"
export =(server:http.Server)=>{
    const io = new Server(server)
    io.on("connection", (socket) => {
      console.log("a user connected " + socket.id)
      echoHandler(io, socket)
      })
    return io
}
      
