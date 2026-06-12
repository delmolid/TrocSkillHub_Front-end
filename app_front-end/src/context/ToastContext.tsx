import React, { createContext, useContext, useRef, type ReactNode } from "react";
import { Toast, type ToastMessage } from "primereact/toast";

interface ToastContextValue {
  showToast: (message: ToastMessage) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_BASE = "rounded-lg border-l-4 shadow-md font-sans";

export const TOAST_SEVERITY = {
  success: `${TOAST_BASE} bg-[#87986f]/20 border-[#87986f]`,
  info:    `${TOAST_BASE} bg-[#176b87]/10 border-[#176b87]`,
  warn:    `${TOAST_BASE} bg-[#70744f]/10 border-[#70744f]`,
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
          summary:     { className: "font-bold text-base text-[#060605]" },
          detail:      { className: "text-xs text-[#060605]/80 mt-0.5" },
          closeButton: { className: "text-[#060605]/40 hover:text-[#060605] transition-opacity ml-auto" },
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
