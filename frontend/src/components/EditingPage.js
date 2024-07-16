import React, { useContext, useEffect } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";

import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import CodeMirror from "codemirror";
import { AppContext } from "../context/AppContext";

const EditingPage = ({
  value,
  setValue,
  editorRef,
  isEditingMode,
  isRoomEditingMode,
  openCreateDocument,
  currentDocument,
}) => {
  const { socket, authUser } = useContext(AppContext);

  const getReadOnlyStatus = () => {
    if (openCreateDocument || isEditingMode || isRoomEditingMode) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    const init = async () => {
      const editor = CodeMirror.fromTextArea(
        document.getElementById("codeEditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
          readOnly: getReadOnlyStatus(),
        }
      );
      editorRef.current = editor;

      editor.setSize(null, "100%");

      editor.on("change", (instance, changes) => {
        const { origin } = changes;
        if (isEditingMode || openCreateDocument || isRoomEditingMode) {
          if (origin !== "setValue") {
            const code = instance.getValue();
            setValue(code);
          }
        }
      });
    };
    init();
  }, [openCreateDocument, isEditingMode, isRoomEditingMode]);

  useEffect(() => {
    if (isEditingMode || isRoomEditingMode) {
      editorRef.current.setValue(value);
    }
  }, [isEditingMode, isRoomEditingMode]);

  useEffect(() => {
    if (socket && isRoomEditingMode) {
      editorRef.current.on("cursorActivity", () => {
        const cursor = editorRef.current.getCursor();
        socket.emit(
          "onChangeCursor",
          cursor,
          currentDocument?._id,
          authUser._id
        );
      });
    }
  }, [socket, value, isRoomEditingMode]);

  return (
    <div className="h-[93vh] overflow-y-scroll custom-scrollbar rounded-md">
      <textarea id="codeEditor" />
    </div>
  );
};

export default EditingPage;
