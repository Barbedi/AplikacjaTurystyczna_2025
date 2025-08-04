import { JSX, useCallback, useState } from "react";
import Toast from "../components/Toast";
import { ToastProps } from "../assets/Data";

const useToast = () => {
  const [toast, setToast] = useState<JSX.Element | null>(null);

  const createToast = useCallback(
    ({ message, type, icon, action, timeout = 5000, onClose }: ToastProps) => {
      setToast(() => (
        <Toast
          type={type}
          message={message}
          icon={icon}
          timeout={timeout}
          action={
            action
              ? {
                  label: action.label,
                  onClick: () => {
                    action.onClick();
                    setToast(null);
                  },
                }
              : undefined
          }
          onClose={() => {
            setToast(null);
            if (onClose) {
              onClose();
            }
          }}
        />
      ));
    },
    []
  );

  return { toast, createToast } as const;
};

export default useToast;