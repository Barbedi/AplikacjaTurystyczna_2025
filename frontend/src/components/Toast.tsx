import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, faTimes } from "@fortawesome/free-solid-svg-icons";

interface ToastProps {
  message: string;
  onClose: () => void;
  type?: "primary" | "alt" | "warning" | "danger";
  icon?: IconDefinition;
  action?: {
    label: string;
    onClick: () => void;
  };
  timeout?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  onClose,
  type = "primary",
  icon,
  action,
  timeout = 5000,
}) => {
  const [open, setOpen] = useState(true);
  const [closing, setClosing] = useState(false);

  const closeHandler = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      onClose();
    }, 500); 
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      closeHandler();
    }, timeout);

    return () => clearTimeout(timer);
  }, [closeHandler, timeout]);

  if (!open) return null;

  const typeColors: Record<string, string> = {
    primary: "bg-blue-600/90 backdrop-blur-lg text-white border-blue-500/50",
    alt: "bg-slate-800/90 backdrop-blur-lg text-white border-slate-600/50",
    warning: "bg-amber-600/90 backdrop-blur-lg text-white border-amber-500/50",
    danger: "bg-red-600/90 backdrop-blur-lg text-white border-red-500/50",
  };

  const progressBarColors: Record<string, string> = {
    primary: "bg-blue-400/80",
    alt: "bg-slate-400/80",
    warning: "bg-amber-400/80",
    danger: "bg-red-400/80",
  };

  return (
            <div
          className={`fixed top-9 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 ${
            closing ? "scale-95 opacity-0" : "scale-100 opacity-100"
          }`}
        >
            <div
          className={`min-w-3xl w-full max-w-sm border-l-4 rounded shadow-lg p-4 flex flex-col gap-2 ${
            typeColors[type]
          }`}
        >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {icon && <FontAwesomeIcon icon={icon} className="text-lg" />}
            <p className="text-sm">{message}</p>
          </div>
          <button
            onClick={closeHandler}
            className="ml-4 text-white hover:text-gray-200"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {action && (
          <button
            onClick={action.onClick}
            className={`self-start px-3 py-1 mt-1 text-sm font-medium border rounded hover:opacity-90 transition ${
              type === "alt"
                ? "border-white text-white"
                : `border-white text-white`
            }`}
          >
            {action.label}
          </button>
        )}

        <div className="w-full h-1 bg-white/30 rounded overflow-hidden">
          <div
            className={`${progressBarColors[type]} h-full animate-progress`}
            style={{ animationDuration: `${timeout}ms` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Toast;
