import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  country: string;
};

const COUNTRY_OPTIONS = [
  "France",
] as const;

const FRANCE = "France";

export const AuthentificationForm: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loginMessage, setLoginMessage] = useState("");
  const [signupMessage, setSignupMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("France");

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
    setValue,
    formState: { errors: signupErrors },
  } = useForm<RegisterFields>({
    defaultValues: {
      country: "",
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
        country: data.country,
      });

      setSignupMessage(response.message);
      resetSignup();
      setSelectedCountry("");

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

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setValue("country", country);
    setValue("city", "");
  };

  const password = watch("password");

  return (
    <div className="grid min-h-screen grid-cols-[1fr_auto_1fr] items-center bg-page-bg p-8 box-border max-lg:grid-cols-1 max-lg:grid-rows-[auto_auto_auto] max-lg:px-6 max-lg:py-8 max-md:px-4 max-md:py-5">
      <div className="flex flex-col items-center justify-center gap-6 p-12 max-lg:gap-5 max-lg:px-6 max-lg:py-8 max-md:gap-4 max-md:p-5 max-sm:px-2 max-sm:py-4">
        <p className="m-0 text-center text-[1.1rem] font-bold tracking-[0.05em] text-[#2c5f72] max-md:text-base max-sm:text-[0.95rem]">
          NOUVEAU CLIENT ? INSCRIVEZ-VOUS
        </p>
        <p className="m-0 max-w-[320px] text-center text-sm text-[#4a7a8a] max-md:text-[0.85rem] max-sm:text-[0.8rem]">
          Créez votre compte en quelques secondes.
        </p>

        {signupMessage && (
          <Alert
            variant={signupMessage.includes("réussie") ? "success" : "error"}
          >
            {signupMessage}
          </Alert>
        )}

        <form onSubmit={handleSignup(onSignup)}>
          <Card variant="auth">
            <CardContent
              className="box-border flex flex-col gap-4 p-0"
              style={{ padding: "clamp(15px, 2.5vw, 32px)" }}
            >
            <div className="flex gap-3 max-md:flex-col">
              <div className="flex flex-1 flex-col gap-1">
                <Controller
                  name="nom"
                  control={signupControl}
                  rules={{ required: "Le nom est requis" }}
                  render={({ field }) => (
                    <Input {...field} variant="auth" placeholder="Votre nom" />
                  )}
                />
                {signupErrors.nom && (
                  <Alert variant="error">{signupErrors.nom.message}</Alert>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <Controller
                  name="prenom"
                  control={signupControl}
                  rules={{ required: "Le prénom est requis" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="auth"
                      placeholder="Votre prénom"
                    />
                  )}
                />
                {signupErrors.prenom && (
                  <Alert variant="error">{signupErrors.prenom.message}</Alert>
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
                  <Input
                    {...field}
                    variant="auth"
                    placeholder="Votre adresse email"
                    type="email"
                  />
                )}
              />
              {signupErrors.email && (
                <Alert variant="error">{signupErrors.email.message}</Alert>
              )}
            </div>

            <div className="flex gap-3 max-md:flex-col">
              <div className="flex flex-1 flex-col gap-1">
                <Controller
                  name="country"
                  control={signupControl}
                  rules={{ required: "Le pays est requis" }}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleCountryChange(value);
                      }}
                    >
                      <SelectTrigger variant="auth">
                        <SelectValue placeholder="France" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRY_OPTIONS.map((country) => (
                          <SelectItem key={country} value={FRANCE}>
                            {FRANCE}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {signupErrors.country && (
                  <Alert variant="error">{signupErrors.country.message}</Alert>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <Controller
                  name="city"
                  control={signupControl}
                  rules={{ required: "La ville est requise" }}
                  render={({ field }) =>
                    selectedCountry === FRANCE ? (
                      <FranceCityAutocomplete
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        disabled={!selectedCountry}
                      />
                    ) : (
                      <Input
                        {...field}
                        variant="auth"
                        placeholder="Votre ville"
                        disabled={!selectedCountry}
                      />
                    )
                  }
                />
                {signupErrors.city && (
                  <Alert variant="error">{signupErrors.city.message}</Alert>
                )}
              </div>
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
                  <Input
                    {...field}
                    variant="auth"
                    type="password"
                    placeholder="Votre mot de passe"
                  />
                )}
              />
              {signupErrors.password && (
                <Alert variant="error">{signupErrors.password.message}</Alert>
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
                  <Input
                    {...field}
                    variant="auth"
                    type="password"
                    placeholder="Confirmez votre mot de passe"
                  />
                )}
              />
              {signupErrors.confirmPassword && (
                <Alert variant="error">
                  {signupErrors.confirmPassword.message}
                </Alert>
              )}
            </div>

            <Button type="submit" variant="auth" disabled={isLoading}>
              {isLoading ? "Chargement..." : "Créer mon compte"}
            </Button>
            </CardContent>
          </Card>
        </form>
      </div>

      {/* SÉPARATEUR */}
      <div className="flex h-[300px] flex-col items-center justify-center gap-3 px-6 max-lg:mx-auto max-lg:h-auto max-lg:w-full max-lg:max-w-[420px] max-lg:flex-row max-lg:px-0 max-lg:py-2">
        <div className="w-px flex-1 bg-[#b4cfe0] max-lg:h-px max-lg:w-auto" />
        <span className="text-sm font-semibold uppercase tracking-[0.1em] text-[#4a7a8a]">
          ou
        </span>
        <div className="w-px flex-1 bg-[#b4cfe0] max-lg:h-px max-lg:w-auto" />
      </div>

      {/* CONNEXION */}
      <div className="flex flex-col items-center justify-center gap-6 p-12 max-lg:gap-5 max-lg:px-6 max-lg:py-8 max-md:gap-4 max-md:p-5 max-sm:px-2 max-sm:py-4">
        <p className="m-0 text-center text-[1.1rem] font-bold tracking-[0.05em] text-[#2c5f72] max-md:text-base max-sm:text-[0.95rem]">
          DÉJÀ CLIENT ? CONNECTEZ-VOUS
        </p>
        <p className="m-0 max-w-[320px] text-center text-sm text-[#4a7a8a] max-md:text-[0.85rem] max-sm:text-[0.8rem]">
          Connectez-vous avec votre adresse mail et votre mot de passe.
        </p>

        {loginMessage && (
          <Alert
            variant={loginMessage.includes("réussie") ? "success" : "error"}
          >
            {loginMessage}
          </Alert>
        )}

        <form onSubmit={handleLogin(onLogin)}>
          <Card variant="auth">
            <CardContent
              className="box-border flex flex-col gap-4 p-0"
              style={{ padding: "clamp(15px, 2.5vw, 32px)" }}
            >
            <div className="flex flex-col gap-1">
              <Controller
                name="email"
                control={loginControl}
                rules={{ required: "L'adresse email est requise" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    variant="auth"
                    placeholder="Votre email"
                    type="email"
                  />
                )}
              />
              {loginErrors.email && (
                <Alert variant="error">{loginErrors.email.message}</Alert>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Controller
                name="password"
                control={loginControl}
                rules={{ required: "Le mot de passe est requis" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    variant="auth"
                    type="password"
                    placeholder="Votre mot de passe"
                  />
                )}
              />
              {loginErrors.password && (
                <Alert variant="error">{loginErrors.password.message}</Alert>
              )}
            </div>

            <Button type="submit" variant="auth" disabled={isLoading}>
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};
