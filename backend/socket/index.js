const { Server } = require("socket.io");

const connectSocket = async (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  const documents = {};
  const users = {};

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("getActiveDocs", () => {
      io.emit("activeDocs", users);
    });

    socket.on("createDocRoom", (doc, user) => {
      const { _id: documentId } = doc;
      documents[documentId] = doc;
      users[documentId] = [{ ...user, socketId: socket.id }];
      socket.join(documentId);

      io.to(documentId).emit("getNotification", null, "Room created");
      io.emit("activeDocs", users);
    });

    socket.on("joinDocRoom", (doc, user) => {
      const { _id: documentId } = doc;

      if (documents[documentId]) {
        users[documentId] = [
          ...users[documentId],
          { ...user, socketId: socket.id },
        ];
        socket.join(documentId);
        socket.emit("setDocument", documents[documentId]);

        io.to(documentId).emit(
          "getNotification",
          user?._id,
          `${user?.username} is joined`
        );

        io.emit("activeDocs", users);
        io.to(socket.id).emit("warningMsg", null);
      } else {
        io.to(socket.id).emit("warningMsg", "Room ID is not found");
      }
    });

    socket.on("onChangeContent", (doc) => {
      const { _id: documentId, content, onChangeUser } = doc;
      if (documents[documentId]) {
        documents[documentId] = { ...documents[documentId], content };

        io.to(documentId).emit("setOnChangeContent", {
          ...documents[documentId],
          onChangeUser,
        });
      }
    });

    socket.on("showNotification", (docId, userId, msg) => {
      if (documents[docId]) {
        io.to(docId).emit("getNotification", userId, msg);
      }
    });

    socket.on("onChangeCursor", (data, documentId, userId) => {
      if (documents[documentId]) {
        io.to(documentId).emit("setOnChangeCursor", data, userId);
      }
    });

    socket.on("leaveDocument", (doc) => {
      const { _id: documentId } = doc;
      if (users[documentId]) {
        const updatedUsers = users[documentId].filter(
          (user) => user.socketId !== socket.id
        );
        users[documentId] = updatedUsers;
        socket.leave(documentId);
        io.emit("activeDocs", users);
      }
    });

    socket.on("exitRoom", (docId) => {
      if (documents[docId]) {
        socket.leave(docId);

        delete documents[docId];
        delete users[docId];

        io.to(docId).emit("getNotification", null, "Room exited");
        io.emit("activeDocs", users);

        io.to(docId).emit("setExitRoom");
      }
    });

    socket.on("disconnect", () => {
      let leaveUser;

      for (let documentId of Object.keys(users)) {
        users[documentId] = users[documentId].filter((user) => {
          if (user.socketId === socket.id) {
            leaveUser = { ...user, docId: documentId };
          } else {
            return user;
          }
        });

        if (users[documentId].length === 0) {
          delete documents[documentId];
          delete users[documentId];
        }
      }
      io.emit("activeDocs", users);
      if (leaveUser) {
        io.to(leaveUser?.docId).emit(
          "getNotification",
          leaveUser?._id,
          `${leaveUser?.username} is leave`
        );
      }
    });
  });
};

module.exports = connectSocket;
