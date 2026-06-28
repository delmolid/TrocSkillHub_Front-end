import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { login as loginUser } from "../../services/authService";
import type { LoginFields } from "../../types/auth.types";
import { AuthMessage } from "./AuthMessage";

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>();

  const onSubmit = async (data: LoginFields) => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await loginUser(data);
      setMessage(response.message);
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

      setTimeout(() => {
        navigate({ to: "/profile" });
      }, 1500);
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-12 max-lg:gap-5 max-lg:px-6 max-lg:py-8 max-md:gap-4 max-md:p-5 max-sm:px-2 max-sm:py-4">
      <p className="m-0 text-center font-heading text-xl font-bold tracking-[0.05em] text-text max-md:text-base max-sm:text-sm">
        DÉJÀ CLIENT ? CONNECTEZ-VOUS
      </p>
      <p className="m-0 max-w-[320px] text-center font-body text-sm text-text">
        Connectez-vous avec votre adresse mail et votre mot de passe.
      </p>

      {message && (
        <AuthMessage variant={message.includes("réussie") ? "success" : "error"}>
          {message}
        </AuthMessage>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className="auth-form-panel flex flex-col gap-4"
          style={{ padding: "clamp(15px, 2.5vw, 32px)" }}
        >
          <div className="flex flex-col gap-1">
            <Controller
              name="email"
              control={control}
              rules={{ required: "L'adresse email est requise" }}
              render={({ field }) => (
                <InputText {...field} placeholder="Votre email" type="email" />
              )}
            />
            {errors.email && (
              <AuthMessage variant="error">{errors.email.message}</AuthMessage>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Controller
              name="password"
              control={control}
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
            {errors.password && (
              <AuthMessage variant="error">{errors.password.message}</AuthMessage>
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
  );
};
