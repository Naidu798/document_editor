import React, { useContext, useEffect, useState } from "react";
import Created from "./Created";
import Edited from "./Edited";
import { AppContext } from "../context/AppContext";
import backendDomain from "../common";
import Logo from "./Logo";
import { useNavigate } from "react-router-dom";

const bgColors = [
  "bg-green-500",
  "bg-blue-500",
  "bg-slate-300",
  "bg-red-500",
  "bg-yellow-500",
  "bg-violet-500",
];
let randomColor = "";

const Profile = ({
  setOpenCreateDocument,
  openCreateDocument,
  codeValue,
  setCodeValue,
  docTitle,
  editorRef,
  setDocTitle,
  setCurrentDocument,
  currentDocument,
  setOpenJoinRoom,
}) => {
  const {
    authUser,
    customToast,
    editedDocs,
    createdDocs,
    setCreatedDocs,
    setAuthUser,
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState("CREATED");

  const navigate = useNavigate();

  const createDocument = async () => {
    try {
      const res = await fetch(backendDomain.document.create, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ code: codeValue, title: docTitle }),
      });
      const data = await res.json();
      if (data.success) {
        console.log(data.data);
        setDocTitle("");
        editorRef.current.setValue("");
        setCreatedDocs((prev) => [data.data, ...prev]);
        customToast("success", data.message);
      } else {
        customToast("error", data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSaveDocument = () => {
    if (docTitle.trim() === "" || docTitle.length < 3) {
      return customToast(
        "error",
        "Document title must be at least 3 characters"
      );
    } else if (!codeValue) {
      return customToast("error", "Please write some code");
    }

    createDocument();
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(backendDomain.auth.logout, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setCurrentDocument(null);
        setDocTitle("");
        setAuthUser(null);
        editorRef.current.setValue("");
        customToast("success", data.message);
        navigate("/login");
      } else {
        customToast("error", data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const generateRandomColor = () => {
      const index = Math.floor(Math.random() * bgColors.length);
      randomColor = bgColors[index];
    };
    generateRandomColor();
  }, []);

  return (
    <div className=" flex flex-col justify-between h-full">
      <div>
        <div className="w-full flex justify-center pt-4 pb-2">
          <Logo
            t="text-xl text-gray-300"
            l="h-7 text-gray-500"
            i="h-7 w-7 text-gray-300"
          />
        </div>
        <hr className="border border-gray-500 mt-2" />
        <div className="py-2">
          <div className="flex items-center gap-3 mt-2 mx-4">
            <div
              className={`h-12 w-12 rounded-full bg-gray-400 flex justify-center items-center text-white text-3xl ${randomColor}`}
            >
              {authUser?.username?.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-100 mb-1">
                {authUser?.username}
              </h3>
              <span className="text-md text-gray-300">
                {activeTab === "CREATED"
                  ? createdDocs.length
                  : editedDocs.length}{" "}
                Documents
              </span>
            </div>
          </div>
          <hr className="border border-gray-500 mt-4 mx-4" />
          <div className="flex items-center justify-evenly mt-3 mx-4">
            <button
              onClick={() => setActiveTab("CREATED")}
              className={`text-white text-xl font-semibold pb-2 ${
                activeTab === "CREATED" &&
                "border-b-4 border-b-gray-300 rounded-sm"
              }`}
            >
              Created
            </button>
            <button
              onClick={() => setActiveTab("EDITED")}
              className={`text-white text-xl font-semibold pb-2 ${
                activeTab === "EDITED" &&
                "border-b-4 border-b-gray-300 rounded-sm"
              }`}
            >
              Room Edited
            </button>
          </div>
          <hr className="border border-gray-500" />
          <div className="overflow-y-scroll h-[56vh] custom-scrollbar px-4">
            {activeTab === "CREATED" ? (
              <Created
                setCurrentDocument={setCurrentDocument}
                setOpenCreateDocument={setOpenCreateDocument}
                currentDocument={currentDocument}
              />
            ) : (
              <Edited
                setCurrentDocument={setCurrentDocument}
                currentDocument={currentDocument}
                setOpenCreateDocument={setOpenCreateDocument}
              />
            )}
          </div>
        </div>
      </div>
      <div className="pb-4 px-4">
        {activeTab === "CREATED" &&
          (openCreateDocument ? (
            <button
              onClick={handleSaveDocument}
              className="bg-blue-600 w-full pb-0.5 rounded-full text-gray-300 text-lg outline-none"
            >
              Save Document
            </button>
          ) : (
            <button
              onClick={() => {
                setCodeValue("");
                setDocTitle("");
                setCurrentDocument(null);
                setOpenCreateDocument(true);
              }}
              className="bg-green-600 w-full pb-0.5 rounded-full text-gray-300 text-lg outline-none"
            >
              Create Document
            </button>
          ))}
        {activeTab === "EDITED" && (
          <button
            onClick={() => {
              setOpenJoinRoom(true);
            }}
            className="bg-green-600 w-full pb-0.5 rounded-full text-gray-300 text-lg outline-none"
          >
            Join Room
          </button>
        )}
        <button
          onClick={handleLogout}
          className="bg-transparent text-red-500 border border-red-500 w-full pb-0.5 rounded-full text-lg outline-none mt-3"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
