"use client";

import { ReactNode } from "react";
import { FaX } from "react-icons/fa6";

export default function Modal({
  children,
  onClose,
  open,
  title,
}: {
  children: ReactNode;
  open: boolean;
  title?: string;
  onClose: () => void;
}) {
  return (
    <div
      data-open={open}
      className="w-full z-[100] absolute top-0 left-0 h-full justify-center items-center p-3 bg-black/60 backdrop-blur-md data-[open=true]:flex hidden"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 rounded-lg p-4 relative max-w-lg"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="mb-4 flex items-center justify-between text-xl px-0.5">
          <h3>{title}</h3>
          <button onClick={onClose}>
            <FaX />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
