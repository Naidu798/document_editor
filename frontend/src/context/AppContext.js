import { createContext, useLayoutEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import backendDomain from "../common";

export const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);

  const [socket, setSocket] = useState(null);
  const [activeDocUsers, setActiveDocUsers] = useState({});

  const [createdDocs, setCreatedDocs] = useState([]);
  const [editedDocs, setEditedDocs] = useState([]);

  const [isEditingMode, setIsEditingMode] = useState(false);
  const [isRoomEditingMode, setIsRoomEditingMode] = useState(false);

  const editorRef = useRef(null);

  const customToast = (type, msg) => {
    return toast[type](msg, {
      style: {
        borderRadius: "6px",
        background: "#333",
        color: "#fff",
      },
      position: type === "success" ? "top-center" : "top-right",
    });
  };

  const getAuthUser = async () => {
    try {
      const res = await fetch(backendDomain.user.getUser, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setAuthUser(data.data);
      }
      //  else {
      //   customToast("error", data.message);
      // }
    } catch (err) {
      console.log(err);
    }
  };

  useLayoutEffect(() => {
    getAuthUser();
  }, []);

  return (
    <AppContext.Provider
      value={{
        customToast,
        authUser,
        setAuthUser,
        createdDocs,
        setCreatedDocs,
        editedDocs,
        setEditedDocs,
        isEditingMode,
        setIsEditingMode,
        isRoomEditingMode,
        setIsRoomEditingMode,
        socket,
        setSocket,
        activeDocUsers,
        setActiveDocUsers,
        editorRef,
        // getCurrentUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
