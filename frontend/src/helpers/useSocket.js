import { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { AppContext } from "../context/AppContext";

const socket = io("http://localhost:5000");

const useSocket = (documentId, isRoomEditingMode) => {
  const { authUser } = useContext(AppContext);
  // const [document, setDocument] = useState(null);
  // const [cursors, setCursors] = useState({});
  // const [users, setUsers] = useState([]);

  useEffect(() => {
    if (authUser) {
      console.log("sockets trigger");

      const user = {
        username: authUser?.username,
        _id: authUser?._id,
      };

      socket.emit("setUser", user);

      socket.on("activeEditingDocs", (documents) => {
        console.log("activeEditingDocs", documents);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [authUser]);

  useEffect(() => {
    if (isRoomEditingMode) {
      console.log("documentId in socket", documentId);
      const user = {
        username: authUser?.username,
        _id: authUser?._id,
      };

      socket.emit("joinDocument", documentId, user);

      // socket.on("loadDocument", (doc) => {
      //   setDocument(doc);
      // });

      // socket.on("updateDocument", (doc) => {
      //   setDocument(doc);
      // });

      // socket.on("updateCursor", (data) => {
      //   setCursors((prevCursors) => ({
      //     ...prevCursors,
      //     [data.userId]: data.cursorPosition,
      //   }));
      // });

      socket.on("activeEditingDocs", (documents) => {
        console.log("activeEditingDocs", documents);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [isRoomEditingMode]);

  // const updateDocument = (content) => {
  //   socket.emit("editDocument", { documentId, content });
  // };

  // const moveCursor = (cursorPosition, userId) => {
  //   socket.emit("cursorMove", { documentId, cursorPosition, userId });
  // };

  return { document };
};

export default useSocket;
