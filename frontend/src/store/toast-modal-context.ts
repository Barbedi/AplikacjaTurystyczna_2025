import { createContext, JSX } from "react";
import { ToastProps } from "../assets/Data";

interface ToastModalContextProps {
  toast: JSX.Element | null;
  createToast: (props: ToastProps) => void;
}

const ToastModalContext = createContext({} as ToastModalContextProps);

export default ToastModalContext;
