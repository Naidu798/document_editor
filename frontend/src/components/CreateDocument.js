import React from "react";
import Logo from "./Logo";
import { RxCrossCircled } from "react-icons/rx";

const CreateDocument = ({ setOpenJoinRoom }) => {
  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-gray-400 bg-opacity-20">
      <div className="h-full w-full p-5 flex justify-center items-center">
        <div className="border-4 rounded-xl bg-slate-700">
          <div className="flex justify-end pr-3 pt-3">
            <RxCrossCircled
              className="text-white text-3xl"
              onClick={() => setOpenJoinRoom(false)}
            />
          </div>
          <div
            className={`flex flex-col md:gap-7 md:px-10 md:pt-5 md:pb-10 py-5 px-4`}
          >
            <div className="w-full flex justify-center">
              <Logo
                t="text-xl text-gray-300"
                l="h-7 text-gray-500"
                i="h-7 w-7 text-gray-300"
              />
            </div>

            <form
              className="flex flex-col gap-2 md:w-[35vw] lg:w-[25vw] sm:w-[70vw] w-[80vw]"
              // onSubmit={handleSubmitForm}
              id="loginUser"
            >
              <div
                className={`flex items-center pl-2 rounded-lg bg-white border `}
              >
                <input
                  type="text"
                  placeholder=""
                  // value={data.username}
                  required
                  // onChange={(e) =>
                  //   setData((prev) => ({ ...prev, username: e.target.value }))
                  // }
                  className={`h-9 w-full outline-none px-2 rounded-lg pb-0.5 text-md`}
                />
              </div>
              <button
                type="submit"
                className="text-white bg-blue-500 hover:bg-blue-600 rounded-full w-full pb-2 pt-1.5 mt-2"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDocument;
