import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { FRANCE } from "../../constantes";
import { login as loginUser, register as registerUser } from "../../services/authService";
import type { RegisterFields } from "../../types/auth.types";
import { AuthMessage } from "./AuthMessage";
import { FranceCityAutocomplete } from "./FranceCityAutocomplete";

const passwordTogglePt = {
  showIcon: {
    "aria-label": "Afficher le mot de passe",
  },
  hideIcon: {
    "aria-label": "Masquer le mot de passe",
  },
};

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RegisterFields>({
    defaultValues: {
      city: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterFields) => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await registerUser({
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        password: data.password,
        city: data.city,
        country: FRANCE,
      });

      setMessage(response.message);
      reset();

      setTimeout(async () => {
        await loginUser({
          email: data.email,
          password: data.password,
        });
        await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
        navigate({ to: "/profile" });
      }, 1500);
    } catch (error: unknown) {
      setMessage(
        error instanceof Error ? error.message : "Erreur d'inscription",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-12 max-lg:gap-5 max-lg:px-6 max-lg:py-8 max-md:gap-4 max-md:p-5 max-sm:px-2 max-sm:py-4">
      <p className="m-0 text-center font-heading text-xl font-bold tracking-[0.05em] text-text max-md:text-base max-sm:text-sm">
        NOUVEAU CLIENT ? INSCRIVEZ-VOUS
      </p>
      <p className="m-0 max-w-[320px] text-center font-body text-sm text-text">
        Créez votre compte en quelques secondes.
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
          <div className="flex gap-3 max-md:flex-col">
            <div className="flex flex-1 flex-col gap-1">
              <label htmlFor="register-nom" className="auth-field-label">
                Nom
              </label>
              <Controller
                name="nom"
                control={control}
                rules={{ required: "Le nom est requis" }}
                render={({ field }) => (
                  <InputText
                    {...field}
                    id="register-nom"
                    placeholder="Votre nom"
                    autoComplete="family-name"
                  />
                )}
              />
              {errors.nom && (
                <AuthMessage variant="error">{errors.nom.message}</AuthMessage>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <label htmlFor="register-prenom" className="auth-field-label">
                Prénom
              </label>
              <Controller
                name="prenom"
                control={control}
                rules={{ required: "Le prénom est requis" }}
                render={({ field }) => (
                  <InputText
                    {...field}
                    id="register-prenom"
                    placeholder="Votre prénom"
                    autoComplete="given-name"
                  />
                )}
              />
              {errors.prenom && (
                <AuthMessage variant="error">{errors.prenom.message}</AuthMessage>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="register-email" className="auth-field-label">
              Adresse email
            </label>
            <Controller
              name="email"
              control={control}
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
                  id="register-email"
                  placeholder="Votre adresse email"
                  type="email"
                  autoComplete="email"
                />
              )}
            />
            {errors.email && (
              <AuthMessage variant="error">{errors.email.message}</AuthMessage>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="register-city" id="register-city-label" className="auth-field-label">
              Ville
            </label>
            <Controller
              name="city"
              control={control}
              rules={{ required: "La ville est requise" }}
              render={({ field }) => (
                <FranceCityAutocomplete
                  id="register-city"
                  aria-labelledby="register-city-label"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            {errors.city && (
              <AuthMessage variant="error">{errors.city.message}</AuthMessage>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="register-password" className="auth-field-label">
              Mot de passe
            </label>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Le mot de passe est requis",
                minLength: {
                  value: 8,
                  message: "Le mot de passe doit contenir au moins 8 caractères",
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
                  inputId="register-password"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  placeholder="Votre mot de passe"
                  toggleMask
                  feedback={false}
                  className="w-full"
                  autoComplete="new-password"
                  pt={passwordTogglePt}
                />
              )}
            />
            {errors.password && (
              <AuthMessage variant="error">{errors.password.message}</AuthMessage>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="register-confirm-password" className="auth-field-label">
              Confirmer le mot de passe
            </label>
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Veuillez confirmer votre mot de passe",
                validate: (value) =>
                  value === password || "Les mots de passe ne correspondent pas",
              }}
              render={({ field }) => (
                <Password
                  inputId="register-confirm-password"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  placeholder="Confirmez votre mot de passe"
                  toggleMask
                  feedback={false}
                  className="w-full"
                  autoComplete="new-password"
                  pt={passwordTogglePt}
                />
              )}
            />
            {errors.confirmPassword && (
              <AuthMessage variant="error">
                {errors.confirmPassword.message}
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
  );
};
