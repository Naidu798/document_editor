import React, { useEffect, useState, useRef } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import useSocket from "../helpers/useSocket";

const Editor = ({ documentId, userId }) => {
  const { document, updateDocument, cursors, moveCursor, users } = useSocket(
    documentId,
    userId
  );
  const [content, setContent] = useState("");
  const editorRef = useRef();

  useEffect(() => {
    if (document) {
      setContent(document.content);
    }
  }, [document]);

  const handleEditorChange = (editor, data, value) => {
    setContent(value);
    updateDocument(value);
  };

  const handleCursorActivity = (editor) => {
    const cursorPosition = editor.getCursor();
    moveCursor(cursorPosition, userId);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl p-4 bg-white shadow-lg rounded-lg relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Collaborative Editor</h2>
          <div className="flex space-x-2">
            {users.map((user) => (
              <div key={user.userId} className="text-sm text-gray-600">
                {user.userId}
              </div>
            ))}
          </div>
        </div>
        <CodeMirror
          value={content}
          options={{
            mode: "javascript",
            theme: "material",
            lineNumbers: true,
          }}
          onBeforeChange={handleEditorChange}
          onCursorActivity={handleCursorActivity}
          editorDidMount={(editor) => (editorRef.current = editor)}
        />
        {Object.entries(cursors).map(([user, position]) => (
          <div
            key={user}
            className="absolute"
            style={{
              left: `${position.ch * 8}px`,
              top: `${position.line * 24}px`,
            }}
          >
            <span className="text-xs bg-blue-500 text-white p-1 rounded">
              {user}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Editor;
