// sockets/gameSocket.ts
import { Server } from "socket.io";

export default (io: Server) => {
  //   io.on("connection", (socket: Socket) => {
  //     socket.on("joinGame", (gameId: string) => {
  //       gameService.joinGame(socket, gameId);
  //     });

  //     socket.on("makeMove", (moveData) => {
  //       gameService.processMove(socket, moveData);
  //     });
  //   });

  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    io.emit("initial message", "Hello from server");
    socket.on("initial message", (msg) => {
      console.log("message: " + msg);
    });
  });
};
