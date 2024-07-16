import React, { useContext, useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Logo from "../components/Logo";
import backendDomain from "../common";

const Login = () => {
  const { customToast, setAuthUser } = useContext(AppContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const loginUser = async () => {
    try {
      const res = await fetch(backendDomain.auth.login, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (resData.success) {
        customToast("success", resData.message);
        setAuthUser(resData.data);
        navigate("/");
      } else {
        customToast("error", resData.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    loginUser();
  };

  return (
    <div className="h-full w-full p-5 flex justify-center items-center relative">
      <div className="border-4 rounded-xl border-gray-200 md:p-14 py-8 px-4">
        <div className={`flex flex-col md:gap-7 `}>
          <div
            className={`md:flex justify-center mb-6 md:mb-0 md:justify-start hidden`}
          >
            <Logo
              t="text-2xl text-gray-700"
              i="h-10 w-10 text-gray-500"
              l="h-10 border-gray-400"
            />
          </div>
          <div
            className={`md:hidden flex justify-center mb-6 md:mb-0 md:justify-start`}
          >
            <Logo
              t="text-xl text-gray-700"
              i="h-7 w-7 text-gray-500"
              l="h-7 border-gray-400"
            />
          </div>

          <form
            className="flex flex-col gap-2 md:w-[35vw] lg:w-[25vw] sm:w-[70vw] w-[80vw]"
            onSubmit={handleSubmitForm}
            id="loginUser"
          >
            <h2 className={`font-semibold text-lg text-gray-900`}>Let's Go.</h2>

            <div
              className={`flex items-center pl-2 rounded-lg bg-white border `}
            >
              <FaUser className={`h-3 w-5 text-gray-800`} />
              <input
                type="text"
                placeholder="Username"
                value={data.username}
                required
                onChange={(e) =>
                  setData((prev) => ({ ...prev, username: e.target.value }))
                }
                className={`h-9 w-full outline-none px-2 rounded-lg pb-0.5 text-md`}
              />
            </div>
            <div
              className={`flex items-center pl-2 rounded-lg bg-white border`}
            >
              <MdOutlinePassword className={`h-5 w-5 text-gray-800 `} />
              <input
                type="password"
                placeholder="Password"
                value={data.password}
                required
                onChange={(e) =>
                  setData((prev) => ({ ...prev, password: e.target.value }))
                }
                className={`h-9 w-full outline-none px-2 rounded-lg pb-0.5 text-md`}
              />
            </div>

            <button
              type="submit"
              className="text-white bg-blue-500 rounded-full w-full pb-2 pt-1.5 mt-3"
            >
              Login
            </button>
            <p className={`font-medium mt-2 text-gray-900`}>
              Don't have an account?
            </p>
            <Link to="/signup">
              <button className="text-blue-500 border border-blue-500 rounded-full w-full pb-2 pt-1.5">
                Signup
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
