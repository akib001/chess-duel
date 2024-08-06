import React from "react";
import { FaPlus } from "react-icons/fa";

interface BottomBtnProps {
  icon: React.ReactNode;
  onClick: () => void;
  title: string;
}

const BottomBtn: React.FC<BottomBtnProps> = ({ icon, onClick, title }) => {
  return (
    <button
      onClick={onClick}
      title={title}
      className="bg-[hsla(0,0%,100%,.08)] flex justify-center items-center px-5 py-3 text-2xl shadow-md rounded-md hover:bg-[#454440] transition-colors ease-in"
    >
      {icon}
    </button>
  );
};

export default BottomBtn;
