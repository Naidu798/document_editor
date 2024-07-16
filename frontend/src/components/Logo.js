import React from "react";
import { FaLaptopCode } from "react-icons/fa";

const Logo = ({ i, t, l }) => {
  return (
    <div className="flex items-center gap-3 md:gap-5">
      <FaLaptopCode className={`${i}`} />
      <hr className={`border ${l}`} />
      <h2 className={`font-bold uppercase tracking-wider ${t}`}>CodeCast</h2>
    </div>
  );
};

export default Logo;
