import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import backendDomain from "../common";
import formatTime from "../helpers/formatTime";

const Created = ({
  setCurrentDocument,
  currentDocument,
  setOpenCreateDocument,
}) => {
  const {
    customToast,
    createdDocs,
    setCreatedDocs,
    setIsEditingMode,
    editorRef,
    activeDocUsers,
  } = useContext(AppContext);

  const getUserCreatedDocuments = async () => {
    try {
      const res = await fetch(backendDomain.document.created, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setCreatedDocs(data.data);
      } else {
        customToast("error", data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [activeIndex, setActiveIndex] = useState(null);

  const handleClickOnDocument = (doc) => {
    setIsEditingMode(false);
    setCurrentDocument(doc);
    setOpenCreateDocument(false);
    editorRef.current.setValue(doc.content);
  };

  useEffect(() => {
    getUserCreatedDocuments();
  }, []);

  return (
    <ul className="mt-3 flex flex-col gap-1">
      {createdDocs.map((doc, i) => {
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
                <span className="text-gray-400">
                  {doc?.createdAt && formatTime(doc?.createdAt)}
                </span>
              </div>
              <p className="text-green-300 text-ellipsis line-clamp-1">
                {doc?.content}
              </p>
              <button
                onClick={() => {
                  if (i === activeIndex) {
                    setActiveIndex(null);
                  } else {
                    setActiveIndex(i);
                  }
                }}
                className="text-blue-500 outline-none"
              >
                Versions...
              </button>
            </div>
            {activeIndex === i && (
              <ul
                className={`border-2 ${
                  currentDocument?._id === doc?._id
                    ? "border-blue-500"
                    : "border-gray-600"
                } rounded-lg px-3 py-2 mt-2`}
              >
                <h3 className="text-gray-300 mb-3">Document Versions</h3>
                {doc?.versions.map((ver, i) => {
                  return (
                    <li
                      className={`border-2 border-gray-600
                  } rounded-lg px-3 py-2 mb-2`}
                      key={"versions" + i}
                    >
                      <div className="flex flex-col">
                        <p className="text-gray-400">
                          Version :{" "}
                          <span className="text-gray-300">{ver.version}</span>
                        </p>
                        <p className="text-red-300">{ver?.content}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default Created;
