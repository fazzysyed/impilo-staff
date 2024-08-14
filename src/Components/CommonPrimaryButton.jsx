import React from "react";

const CommonPrimaryButton = ({ onClick, text, loading, classes }) => {
  return (
    <div>
      <button
        onClick={onClick}
        className={`${
          loading ? " bg-blue-700/60 loading_shadow" : "#524494"
        } hover:shadow-[rgba(149, 157, 165, 0.2) 0px 8px 24px 0px] transition-all ease-in-out duration-300 px-6 py-3  bg-[#524494] text-white rounded-md `}
      >
        {!loading ? (
          <div className={classes}>{text}</div>
        ) : (
          <div className="loader">
            <div className="opacity-0">{text}</div>
            <div className="justify-content-center jimu-primary-loading"></div>
          </div>
        )}
      </button>
    </div>
  );
};

export default CommonPrimaryButton;
