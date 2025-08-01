import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-1000"
      onClick={onClose}
    >
      <div
        className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col justify-center items-center gap-2 mt-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
