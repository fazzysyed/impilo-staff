import React from "react";

const CommonInput = ({ label, value, setValue }) => {
  return (
    <div className="">
      <p className="text-base/none pb-2 font-normal text-neutral-600">
        {label}
      </p>
      <div className="relative w-full">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Please Enter ${label}`}
          className="text-lg placeholder-[#B8C0CB] text-neutral-800 py-3 px-4 border border-[#C2C9D4] rounded w-full"
        />
      </div>
    </div>
  );
};

export default CommonInput;
