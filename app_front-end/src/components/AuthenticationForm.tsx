import React from "react";
import { LoginForm } from "./auth/LoginForm";
import { RegisterForm } from "./auth/RegisterForm";

export const AuthentificationForm: React.FC = () => {
  return (
    <div className="grid min-h-screen grid-cols-[1fr_auto_1fr] items-center bg-page-bg p-8 box-border max-lg:grid-cols-1 max-lg:grid-rows-[auto_auto_auto] max-lg:px-6 max-lg:py-8 max-md:px-4 max-md:py-5">
      <RegisterForm />

      <div className="flex h-[300px] flex-col items-center justify-center gap-3 px-6 max-lg:mx-auto max-lg:h-auto max-lg:w-full max-lg:max-w-[420px] max-lg:flex-row max-lg:px-0 max-lg:py-2">
        <div className="w-px flex-1 bg-[#b4cfe0] max-lg:h-px max-lg:w-auto" />
        <span className="font-body text-sm font-bold uppercase tracking-[0.1em] text-text">
          ou
        </span>
        <div className="w-px flex-1 bg-[#b4cfe0] max-lg:h-px max-lg:w-auto" />
      </div>

      <LoginForm />
    </div>
  );
};
