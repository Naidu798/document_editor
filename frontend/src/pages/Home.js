import React, { useContext, useEffect, useRef, useState } from "react";
import EditingPage from "../components/EditingPage";
import Profile from "../components/Profile";
import backendDomain from "../common";
import { AppContext } from "../context/AppContext";
import EditingLeftPanel from "../components/EditingLeftPanel";
import io from "socket.io-client";
import JoinRoom from "../components/JoinRoom";

const Home = () => {
  const {
    customToast,
    isEditingMode,
    setIsEditingMode,
    isRoomEditingMode,
    setIsRoomEditingMode,
    setCreatedDocs,
    setEditedDocs,
    socket,
    setSocket,
    authUser,
    editorRef,
    setActiveDocUsers,
    activeDocUsers,
  } = useContext(AppContext);

  const [openCreateDocument, setOpenCreateDocument] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);

  const [openJoinRoom, setOpenJoinRoom] = useState(false);

  const remoteCursorRef = useRef(null);

  const [docTitle, setDocTitle] = useState("");
  const [codeValue, setCodeValue] = useState("");

  const handleRoomEdit = () => {
    if (!currentDocument) {
      return customToast("error", "Please select document first");
    }
    setIsRoomEditingMode(true);
    const user = {
      username: authUser?.username,
      _id: authUser?._id,
    };
    socket.emit("createDocRoom", currentDocument, user);
  };

  const handleJoinRoomEdit = (e) => {
    if (!currentDocument) {
      return customToast("error", "Please select document first");
    }

    const user = {
      username: authUser?.username,
      _id: authUser?._id,
    };
    socket.emit("joinDocRoom", { _id: currentDocument?._id }, user);
    socket.on("warningMsg", (msg) => {
      if (msg) {
        customToast("error", msg);
      } else {
        setIsRoomEditingMode(true);
      }
    });
  };

  const updateDoc = async (doc) => {
    try {
      const res = await fetch(backendDomain.document.update, {
        method: "PUT",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(doc),
      });
      const data = await res.json();
      if (data.success) {
        setCreatedDocs((prev) =>
          prev.map((doc) => (doc._id === currentDocument._id ? data.data : doc))
        );
        setCurrentDocument(data.data);
        customToast("success", data.message);
      } else {
        customToast("error", data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateRoomDoc = async (doc) => {
    try {
      const res = await fetch(backendDomain.document.roomUpdate, {
        method: "PUT",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(doc),
      });
      const data = await res.json();
      if (data.success) {
        setEditedDocs((prev) => {
          if (prev.includes(data.data._id)) {
            return prev.map((document) =>
              document._id === doc.docId ? data.data : document
            );
          } else {
            return [data.data, ...prev];
          }
        });
        customToast("success", "Document saved successfully");
        socket.emit("showNotification", doc.docId, doc.userId, data.message);
      } else {
        customToast("error", data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSaveDoc = async () => {
    if (docTitle.trim() === "") {
      return customToast("error", "Document title is required");
    } else if (docTitle.trim().length < 3) {
      return customToast("error", "Document title must be 3 or above long");
    } else if (codeValue === "") {
      return customToast("error", "Please write some code");
    }

    const doc = {
      content: codeValue,
      title: docTitle,
      id: currentDocument?._id,
    };

    await updateDoc(doc);
    setIsEditingMode(false);
  };

  const handleSaveRoomDoc = async () => {
    if (docTitle.trim() === "") {
      return customToast("error", "Document title is required");
    } else if (docTitle.trim().length < 3) {
      return customToast("error", "Document title must be 3 or above long");
    } else if (codeValue === "") {
      return customToast("error", "Please write some code");
    }

    const doc = {
      content: editorRef.current.getValue(),
      title: docTitle,
      docId: currentDocument?._id,
      userId: authUser?._id,
    };
    updateRoomDoc(doc);
  };

  useEffect(() => {
    if (currentDocument) {
      setDocTitle(currentDocument?.title);
      setCodeValue(currentDocument?.content);
      editorRef.current.setValue(currentDocument?.content);
    }
  }, [currentDocument]);

  // socket inialization
  useEffect(() => {
    if (authUser) {
      const socket = io("http://localhost:5000");
      setSocket(socket);

      return () => {
        socket.disconnect();
      };
    }
  }, [authUser]);

  // socket listners
  useEffect(() => {
    if (socket) {
      socket.emit("getActiveDocs");

      socket.on("activeDocs", (users) => {
        setActiveDocUsers(users);
      });

      socket.on("setDocument", (doc) => {
        setCurrentDocument(doc);
      });

      socket.on("setOnChangeContent", (doc) => {
        if (authUser?._id !== doc.onChangeUser) {
          if (editorRef.current) {
            editorRef.current.setValue(doc.content);
          }
        }
      });

      socket.on("setOnChangeCursor", (data, userId) => {
        console.log("setOnChangeCursor", data);
        if (authUser._id !== userId) {
          if (editorRef.current) {
            if (remoteCursorRef.current) {
              remoteCursorRef.current.clear();
            }

            const curEle = document.createElement("span");
            curEle.className = "remote-cursor";
            remoteCursorRef.current = editorRef.current.setBookmark(data, {
              widget: curEle,
            });
          }
        } else {
          if (editorRef.current) {
            if (remoteCursorRef.current) {
              remoteCursorRef.current.clear();
            }
          }
        }
      });

      socket.on("getNotification", (userId, msg) => {
        if (authUser?._id !== userId) {
          customToast("success", msg);
        }
      });

      socket.on("setExitRoom", () => {
        setCurrentDocument(null);
        setIsRoomEditingMode(false);
        setDocTitle("");
      });

      return () => {
        socket.disconnect();
        socket.off("activeDocs");
        socket.off("setDocument");
        socket.off("setOnChangeContent");
        socket.off("setOnChangeCursor");
        socket.off("getNotification");
        socket.off("setExitRoom");
      };
    }
  }, [socket]);

  useEffect(() => {
    if (socket && isRoomEditingMode && editorRef.current) {
      const doc = {
        _id: currentDocument?._id,
        content: editorRef.current.getValue(),
        onChangeUser: authUser?._id,
      };
      socket.emit("onChangeContent", doc);
    }
  }, [codeValue, isRoomEditingMode]);

  return (
    <div className="flex items-start h-screen bg-gray-900 shadow-md">
      <div className="h-full w-[400px] bg-gray-800">
        {isRoomEditingMode ? (
          <EditingLeftPanel
            currentDocument={currentDocument}
            setCurrentDocument={setCurrentDocument}
          />
        ) : (
          <Profile
            setOpenCreateDocument={setOpenCreateDocument}
            openCreateDocument={openCreateDocument}
            codeValue={codeValue}
            setCodeValue={setCodeValue}
            docTitle={docTitle}
            setDocTitle={setDocTitle}
            setCurrentDocument={setCurrentDocument}
            currentDocument={currentDocument}
            editorRef={editorRef}
            setOpenJoinRoom={setOpenJoinRoom}
          />
        )}
      </div>
      <div className="h-full w-[calc(100vw-400px)] bg-gray-900 py-1 px-2">
        <>
          <div className="flex items-center gap-4 w-full mb-1">
            <input
              type="text"
              className="w-[70%] h-10 bg-gray-700 outline-none rounded-md px-4 text-md text-white pb-0.5"
              placeholder="Enter Document Title Here..."
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
            />
            {isRoomEditingMode ? (
              <button
                onClick={handleSaveRoomDoc}
                className="h-10 w-[30%] rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-lg tracking-wider"
              >
                Save
              </button>
            ) : isEditingMode ? (
              <button
                onClick={handleSaveDoc}
                className="h-10 w-[30%] rounded-lg bg-slate-700 hover:bg-slate-500 text-white text-lg tracking-wider"
              >
                Save
              </button>
            ) : (
              <div className="w-full flex items-center gap-2">
                {Object.keys(activeDocUsers).length > 0 &&
                Object.keys(activeDocUsers).includes(currentDocument?._id) ? (
                  <button
                    onClick={handleJoinRoomEdit}
                    className="h-10 w-full rounded-lg bg-green-500 hover:bg-green-600 text-white text-md tracking-wider px-3"
                  >
                    Join Room & Edit
                  </button>
                ) : (
                  <button
                    onClick={handleRoomEdit}
                    className="h-10 w-full rounded-lg bg-green-500 hover:bg-green-600 text-white text-md tracking-wider px-3"
                  >
                    Create Room & Edit
                  </button>
                )}
                <button
                  onClick={() => {
                    if (currentDocument) {
                      setIsEditingMode(true);
                    } else {
                      customToast("error", "Please select document first");
                    }
                  }}
                  className="h-10 w-full rounded-lg bg-slate-600 hover:bg-slate-500 text-white text-lg tracking-wider"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
          <EditingPage
            value={codeValue}
            setValue={setCodeValue}
            editorRef={editorRef}
            openCreateDocument={openCreateDocument}
            isEditingMode={isEditingMode}
            isRoomEditingMode={isRoomEditingMode}
            currentDocument={currentDocument}
          />
        </>
      </div>
      {openJoinRoom && (
        <JoinRoom
          setOpenJoinRoom={setOpenJoinRoom}
          setIsRoomEditingMode={setIsRoomEditingMode}
        />
      )}
    </div>
  );
};

export default Home;
