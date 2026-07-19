import React from "react";
import { LoginForm } from "./auth/LoginForm";
import { RegisterForm } from "./auth/RegisterForm";

export const AuthentificationForm: React.FC = () => {
  return (
    <div className="flex w-full flex-1 flex-col bg-white">
      <header className="flex w-full justify-center px-5 pt-8 sm:px-8">
        <div className="w-full max-w-3xl text-center">
          <h1 className="mb-3 font-heading text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Bienvenue sur{" "}
            <span className="text-accent">TROCSKILLHUB</span>
          </h1>
          <p className="text-base leading-relaxed text-text/70 sm:text-lg">
            Rejoignez une communauté où chacun partage ses compétences et ses
            besoins. Inscrivez-vous pour explorer les profils et proposer ou
            recevoir des échanges de compétences.
          </p>
        </div>
      </header>

      <div className="grid w-full flex-1 grid-cols-[1fr_auto_1fr] items-center p-8 box-border max-lg:grid-cols-1 max-lg:grid-rows-[auto_auto_auto] max-lg:px-6 max-lg:py-8 max-md:px-4 max-md:py-5">
        <RegisterForm />

        <div className="flex h-[300px] flex-col items-center justify-center gap-3 px-6 max-lg:mx-auto max-lg:h-auto max-lg:w-full max-lg:max-w-[420px] max-lg:flex-row max-lg:px-0 max-lg:py-2">
          <div className="w-px flex-1 bg-secondary/30 max-lg:h-px max-lg:w-auto" />
          <span className="font-body text-sm font-bold uppercase tracking-[0.1em] text-text">
            ou
          </span>
          <div className="w-px flex-1 bg-secondary/30 max-lg:h-px max-lg:w-auto" />
        </div>

        <LoginForm />
      </div>
    </div>
  );
};
