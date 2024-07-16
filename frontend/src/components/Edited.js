import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import backendDomain from "../common";

const Edited = ({
  setCurrentDocument,
  currentDocument,
  setOpenCreateDocument,
}) => {
  const {
    customToast,
    editedDocs,
    setEditedDocs,
    setIsEditingMode,
    editorRef,
    activeDocUsers,
  } = useContext(AppContext);

  const getUserEditeddDocuments = async () => {
    try {
      const res = await fetch(backendDomain.document.edited, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setEditedDocs(data.data);
      } else {
        customToast("error", data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickOnDocument = (doc) => {
    setIsEditingMode(false);
    setCurrentDocument(doc);
    setOpenCreateDocument(false);
    editorRef.current.setValue(doc.content);
  };

  useEffect(() => {
    getUserEditeddDocuments();
  }, []);

  return (
    <ul className="mt-3 flex flex-col gap-1">
      {editedDocs.map((doc) => {
        return (
          <li
            key={"createdDocument" + doc?._id}
            className="relative cursor-pointer hover:scale-105 hover:transition-all py-2"
          >
            {Object.keys(activeDocUsers).includes(doc?._id) && (
              <span className="bg-gray-800 left-5 top-0 absolute px-1 text-blue-500 text-xs">
                Live editing ongoing...
              </span>
            )}
            <div
              className={`border-2 ${
                currentDocument?._id === doc?._id
                  ? "border-blue-500"
                  : "border-gray-600"
              } rounded-lg px-3 py-2`}
              onClick={() => handleClickOnDocument(doc)}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-100 text-lg">{doc?.title}</span>
                <span className="text-gray-400">{doc?.createdAt}</span>
              </div>
              <p className="text-green-300 text-ellipsis line-clamp-1">
                {doc?.content}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default Edited;
