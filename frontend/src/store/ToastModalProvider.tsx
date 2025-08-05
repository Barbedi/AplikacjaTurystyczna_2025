
import useToast from "../hooks/useToast";
import ToastModalContext from "./toast-modal-context";

interface ToastModalProviderProps {
  children: React.ReactNode;
}

const ToastModalProvider: React.FC<ToastModalProviderProps> = ({ children }) => {
  const { toast, createToast } = useToast();

  return (
    <ToastModalContext.Provider
      value={{
        toast,
        createToast,
      }}
    >
      {children}
      {toast}
    </ToastModalContext.Provider>
  );
};

export default ToastModalProvider;
