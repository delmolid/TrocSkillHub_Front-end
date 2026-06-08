import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { FranceCityAutocomplete } from "./auth/FranceCityAutocomplete";
import { register as registerUser, login as loginUser } from "../services/authService";

type LoginFields = {
  email: string;
  password: string;
};

type RegisterFields = {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  confirmPassword: string;
  city: string;
};

const FRANCE = "France";

function AuthMessage({
  variant,
  children,
}: {
  variant: "error" | "success";
  children: React.ReactNode;
}) {
  return (
    <p className={variant === "success" ? "auth-message-success" : "auth-message-error"}>
      {children}
    </p>
  );
}

export const AuthentificationForm: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loginMessage, setLoginMessage] = useState("");
  const [signupMessage, setSignupMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    control: loginControl,
    handleSubmit: handleLogin,
    formState: { errors: loginErrors },
  } = useForm<LoginFields>();

  const {
    control: signupControl,
    handleSubmit: handleSignup,
    watch,
    reset: resetSignup,
    formState: { errors: signupErrors },
  } = useForm<RegisterFields>({
    defaultValues: {
      city: "",
    },
  });

  const onLogin = async (data: LoginFields) => {
    setIsLoading(true);
    setLoginMessage("");

    try {
      const response = await loginUser(data);
      setLoginMessage(response.message);
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (error: unknown) {
      setLoginMessage(error instanceof Error ? error.message : "Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const onSignup = async (data: RegisterFields) => {
    setIsLoading(true);
    setSignupMessage("");

    try {
      const response = await registerUser({
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        password: data.password,
        city: data.city,
        country: FRANCE,
      });

      setSignupMessage(response.message);
      resetSignup();

      setTimeout(async () => {
        await loginUser({
          email: data.email,
          password: data.password,
        });
        await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
        navigate("/profile");
      }, 1500);
    } catch (error: unknown) {
      setSignupMessage(
        error instanceof Error ? error.message : "Erreur d'inscription",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const password = watch("password");

  return (
    <div className="grid min-h-screen grid-cols-[1fr_auto_1fr] items-center bg-page-bg p-8 box-border max-lg:grid-cols-1 max-lg:grid-rows-[auto_auto_auto] max-lg:px-6 max-lg:py-8 max-md:px-4 max-md:py-5">
      <div className="flex flex-col items-center justify-center gap-6 p-12 max-lg:gap-5 max-lg:px-6 max-lg:py-8 max-md:gap-4 max-md:p-5 max-sm:px-2 max-sm:py-4">
        <p className="m-0 text-center font-heading text-xl font-bold tracking-[0.05em] text-text max-md:text-base max-sm:text-sm">
          NOUVEAU CLIENT ? INSCRIVEZ-VOUS
        </p>
        <p className="m-0 max-w-[320px] text-center font-body text-sm text-text">
          Créez votre compte en quelques secondes.
        </p>

        {signupMessage && (
          <AuthMessage
            variant={signupMessage.includes("réussie") ? "success" : "error"}
          >
            {signupMessage}
          </AuthMessage>
        )}

        <form onSubmit={handleSignup(onSignup)}>
          <div
            className="auth-form-panel flex flex-col gap-4"
            style={{ padding: "clamp(15px, 2.5vw, 32px)" }}
          >
            <div className="flex gap-3 max-md:flex-col">
              <div className="flex flex-1 flex-col gap-1">
                <Controller
                  name="nom"
                  control={signupControl}
                  rules={{ required: "Le nom est requis" }}
                  render={({ field }) => (
                    <InputText {...field} placeholder="Votre nom" />
                  )}
                />
                {signupErrors.nom && (
                  <AuthMessage variant="error">{signupErrors.nom.message}</AuthMessage>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <Controller
                  name="prenom"
                  control={signupControl}
                  rules={{ required: "Le prénom est requis" }}
                  render={({ field }) => (
                    <InputText {...field} placeholder="Votre prénom" />
                  )}
                />
                {signupErrors.prenom && (
                  <AuthMessage variant="error">{signupErrors.prenom.message}</AuthMessage>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <Controller
                name="email"
                control={signupControl}
                rules={{
                  required: "L'adresse email est requise",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email invalide",
                  },
                }}
                render={({ field }) => (
                  <InputText
                    {...field}
                    placeholder="Votre adresse email"
                    type="email"
                  />
                )}
              />
              {signupErrors.email && (
                <AuthMessage variant="error">{signupErrors.email.message}</AuthMessage>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Controller
                name="city"
                control={signupControl}
                rules={{ required: "La ville est requise" }}
                render={({ field }) => (
                  <FranceCityAutocomplete
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
              {signupErrors.city && (
                <AuthMessage variant="error">{signupErrors.city.message}</AuthMessage>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Controller
                name="password"
                control={signupControl}
                rules={{
                  required: "Le mot de passe est requis",
                  minLength: {
                    value: 8,
                    message:
                      "Le mot de passe doit contenir au moins 8 caractères",
                  },
                  validate: {
                    hasUpperCase: (value) =>
                      /[A-Z]/.test(value) ||
                      "Le mot de passe doit contenir au moins une majuscule",
                    hasLowerCase: (value) =>
                      /[a-z]/.test(value) ||
                      "Le mot de passe doit contenir au moins une minuscule",
                    hasNumber: (value) =>
                      /[0-9]/.test(value) ||
                      "Le mot de passe doit contenir au moins un chiffre",
                    hasSpecialChar: (value) =>
                      /[@#$%^&+=!?*]/.test(value) ||
                      "Le mot de passe doit contenir au moins un caractère spécial (@#$%^&+=!?*)",
                  },
                }}
                render={({ field }) => (
                  <Password
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    placeholder="Votre mot de passe"
                    toggleMask
                    feedback={false}
                    className="w-full"
                  />
                )}
              />
              {signupErrors.password && (
                <AuthMessage variant="error">{signupErrors.password.message}</AuthMessage>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Controller
                name="confirmPassword"
                control={signupControl}
                rules={{
                  required: "Veuillez confirmer votre mot de passe",
                  validate: (value) =>
                    value === password ||
                    "Les mots de passe ne correspondent pas",
                }}
                render={({ field }) => (
                  <Password
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    placeholder="Confirmez votre mot de passe"
                    toggleMask
                    feedback={false}
                    className="w-full"
                  />
                )}
              />
              {signupErrors.confirmPassword && (
                <AuthMessage variant="error">
                  {signupErrors.confirmPassword.message}
                </AuthMessage>
              )}
            </div>

            <Button
              type="submit"
              label={isLoading ? "Chargement..." : "Créer mon compte"}
              className="ts-btn-auth"
              disabled={isLoading}
            />
          </div>
        </form>
      </div>

      <div className="flex h-[300px] flex-col items-center justify-center gap-3 px-6 max-lg:mx-auto max-lg:h-auto max-lg:w-full max-lg:max-w-[420px] max-lg:flex-row max-lg:px-0 max-lg:py-2">
        <div className="w-px flex-1 bg-[#b4cfe0] max-lg:h-px max-lg:w-auto" />
        <span className="font-body text-sm font-bold uppercase tracking-[0.1em] text-text">
          ou
        </span>
        <div className="w-px flex-1 bg-[#b4cfe0] max-lg:h-px max-lg:w-auto" />
      </div>

      <div className="flex flex-col items-center justify-center gap-6 p-12 max-lg:gap-5 max-lg:px-6 max-lg:py-8 max-md:gap-4 max-md:p-5 max-sm:px-2 max-sm:py-4">
        <p className="m-0 text-center font-heading text-xl font-bold tracking-[0.05em] text-text max-md:text-base max-sm:text-sm">
          DÉJÀ CLIENT ? CONNECTEZ-VOUS
        </p>
        <p className="m-0 max-w-[320px] text-center font-body text-sm text-text">
          Connectez-vous avec votre adresse mail et votre mot de passe.
        </p>

        {loginMessage && (
          <AuthMessage
            variant={loginMessage.includes("réussie") ? "success" : "error"}
          >
            {loginMessage}
          </AuthMessage>
        )}

        <form onSubmit={handleLogin(onLogin)}>
          <div
            className="auth-form-panel flex flex-col gap-4"
            style={{ padding: "clamp(15px, 2.5vw, 32px)" }}
          >
            <div className="flex flex-col gap-1">
              <Controller
                name="email"
                control={loginControl}
                rules={{ required: "L'adresse email est requise" }}
                render={({ field }) => (
                  <InputText
                    {...field}
                    placeholder="Votre email"
                    type="email"
                  />
                )}
              />
              {loginErrors.email && (
                <AuthMessage variant="error">{loginErrors.email.message}</AuthMessage>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Controller
                name="password"
                control={loginControl}
                rules={{ required: "Le mot de passe est requis" }}
                render={({ field }) => (
                  <Password
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    placeholder="Votre mot de passe"
                    toggleMask
                    feedback={false}
                    className="w-full"
                  />
                )}
              />
              {loginErrors.password && (
                <AuthMessage variant="error">{loginErrors.password.message}</AuthMessage>
              )}
            </div>

            <Button
              type="submit"
              label={isLoading ? "Connexion..." : "Se connecter"}
              className="ts-btn-auth"
              disabled={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
