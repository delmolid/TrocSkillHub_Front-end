import React, { createContext, useContext, useRef, type ReactNode } from "react";
import { Toast, type ToastMessage } from "primereact/toast";

interface ToastContextValue {
  showToast: (message: ToastMessage) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_BASE = "rounded-lg border-l-4 shadow-md font-sans";

export const TOAST_SEVERITY = {
  success: `${TOAST_BASE} bg-primary/20 border-primary`,
  info:    `${TOAST_BASE} bg-secondary/10 border-secondary`,
  warn:    `${TOAST_BASE} bg-accent/10 border-accent`,
  error:   `${TOAST_BASE} bg-red-600/10 border-red-600`,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const toastRef = useRef<Toast>(null);

  const showToast = (message: ToastMessage) => {
    toastRef.current?.show(message);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast
        ref={toastRef}
        pt={{
          summary:     { className: "font-bold text-base text-text" },
          detail:      { className: "text-xs text-text/80 mt-0.5" },
          closeButton: { className: "text-text/40 hover:text-text transition-opacity ml-auto" },
        }}
      />
      {children}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
