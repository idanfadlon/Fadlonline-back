import server from "../app";
import mongoose from "mongoose";
import Client, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

describe("my awesome project", () => {
  let clientSocket: Socket<DefaultEventsMap, DefaultEventsMap>;
  beforeAll((done) => {
    clientSocket = Client("http://localhost:" + process.env.PORT);
    clientSocket.on("connect", done);
  });
  afterAll(() => {
    server.close();
    clientSocket.close();
    mongoose.connection.close();
  });
  test("should work", (done) => {
    clientSocket.onAny((eventName, arg) => {
      console.log("on any");
      expect(eventName).toBe("echo:echo");
      expect(arg.msg).toBe("hello");
      done();
    });
    clientSocket.emit("echo:echo", { msg: "hello" });
  });
});
