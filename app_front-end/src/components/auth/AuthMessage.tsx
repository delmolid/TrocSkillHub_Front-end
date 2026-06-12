import type { AuthMessageProps } from "../../types/auth.types";

export function AuthMessage({ variant, children }: AuthMessageProps) {
  return (
    <p className={variant === "success" ? "auth-message-success" : "auth-message-error"}>
      {children}
    </p>
  );
}
