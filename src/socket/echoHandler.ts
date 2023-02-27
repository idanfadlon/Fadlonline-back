export = (io: any, socket: any) => {
  const echoHandler = (payload) => {
    socket.emit("echo", payload);
  };
  const readHandler = (payload) => {
    // ...
  };
  socket.on("echo:echo", echoHandler);
  socket.on("echo:read", readHandler);
};
