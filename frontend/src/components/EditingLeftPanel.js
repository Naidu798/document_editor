import React, { useContext } from "react";
import Logo from "../components/Logo";
import { AppContext } from "../context/AppContext";

const EditingLeftPanel = ({ currentDocument, setCurrentDocument }) => {
  const {
    activeDocUsers,
    socket,
    setIsRoomEditingMode,
    authUser,
    customToast,
  } = useContext(AppContext);

  const handleLeaveRoom = () => {
    socket.emit("leaveDocument", { _id: currentDocument?._id });
    socket.emit(
      "showNotification",
      currentDocument?._id,
      authUser?._id,
      `${authUser?.username} is leave`
    );
    setIsRoomEditingMode(false);
    setCurrentDocument(null);
  };

  const handleExitRoom = () => {
    socket.emit("exitRoom", currentDocument?._id);
    setIsRoomEditingMode(false);
    setCurrentDocument(null);
  };

  const copyToClipboard = async (copyText) => {
    try {
      await navigator.clipboard.writeText(copyText);
      customToast("success", "Room ID copied");
    } catch (err) {
      customToast("error", "Failed to copy!");
    }
  };

  return (
    <div className="py-3 px-4 flex flex-col justify-between h-full">
      <div>
        <div className="w-full flex justify-center">
          <Logo
            t="text-xl text-gray-300"
            l="h-7 text-gray-500"
            i="h-7 w-7 text-gray-300"
          />
        </div>
        <hr className="border border-gray-500 mt-3" />
        <h3 className="text-gray-300 text-lg my-3">Joined Members</h3>
        {activeDocUsers[currentDocument?._id] && (
          <ul className="flex flex-wrap w-full gap-5">
            {activeDocUsers[currentDocument?._id].map((user) => {
              return (
                <li
                  className="flex items-center gap-2"
                  key={"JoinedUsers" + user._id}
                >
                  <div className="h-10 w-10 rounded-xl bg-blue-500 text-white flex justify-center items-center text-2xl tracking-wider">
                    {user?.username.slice(0, 1).toUpperCase()}
                  </div>
                  <span className="text-gray-300">{user?.username}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div>
        <button
          onClick={() => copyToClipboard(currentDocument?._id)}
          className="text-white text-lg bg-green-500 hover:bg-green-700 pb-1 pt-0.5 w-full rounded-xl mb-3"
        >
          Copy Room ID
        </button>
        {Object.keys(activeDocUsers).length > 0 && (
          <div className="flex items-center gap-4">
            {activeDocUsers[currentDocument?._id] &&
            activeDocUsers[currentDocument?._id][0]?._id === authUser?._id ? (
              <button
                onClick={handleExitRoom}
                className="text-white text-lg bg-red-700 hover:bg-red-800 pb-1 pt-0.5 w-full rounded-xl"
              >
                Exit Room
              </button>
            ) : (
              <button
                onClick={handleLeaveRoom}
                className="text-white text-lg bg-red-500 hover:bg-red-600 pb-1 pt-0.5 w-full rounded-xl"
              >
                Leave Room
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditingLeftPanel;
