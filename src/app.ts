import server from "./server"
import io from "./socket_server"
io(server)

const port = process.env.PORT
server.listen(port, () => {
  console.log("Server started on port " + port)
})

export = server
