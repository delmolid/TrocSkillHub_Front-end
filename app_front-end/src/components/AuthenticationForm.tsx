import { useForm } from "react-hook-form";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as registerUser, login as loginUser } from "../services/authService";
import "./AuthenticationForm.css";

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

// Liste des pays et leurs villes
const COUNTRIES_CITIES: Record<string, string[]> = {
  France: [
    "Paris",
    "Marseille",
    "Lyon",
    "Toulouse",
    "Nice",
    "Nantes",
    "Strasbourg",
    "Montpellier",
    "Bordeaux",
    "Lille",
  ].sort(),
  Espagne: [
    "Madrid",
    "Barcelone",
    "Valence",
    "Séville",
    "Saragosse",
    "Malaga",
    "Murcie",
    "Palma de Majorque",
    "Las Palmas",
    "Bilbao",
  ].sort(),
  Canada: [
    "Toronto",
    "Montreal",
    "Vancouver",
    "Calgary",
    "Edmonton",
    "Ottawa",
    "Winnipeg",
    "Quebec",
    "Hamilton",
    "Kitchener",
  ].sort(),
  Djibouti: [
    "Djibouti",
    "Ali Sabieh",
    "Tadjoura",
    "Obock",
    "Dikhil",
    "Arta",
    "Holhol",
    "Loyada",
    "Balho",
    "Yoboki",
  ].sort(),
  Algérie: [
    "Alger",
    "Oran",
    "Constantine",
    "Annaba",
    "Blida",
    "Batna",
    "Djelfa",
    "Sétif",
    "Sidi Bel Abbès",
    "Biskra",
  ].sort(),
};

export const AuthentificationForm: React.FC = () => {
  const navigate = useNavigate();
  const [loginMessage, setLoginMessage] = useState("");
  const [signupMessage, setSignupMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  const {
    register: registerLogin,
    handleSubmit: handleLogin,
    formState: { errors: loginErrors },
  } = useForm<LoginFields>();

  const {
    register: registerSignup,
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

  // CONNEXION
  const onLogin = async (data: LoginFields) => {
    setIsLoading(true);
    setLoginMessage("");

    try {
      const response = await loginUser(data);
      setLoginMessage(response.message);
      
      setTimeout(() => {
        navigate("/profile-2");
      }, 1500);
    } catch (error: any) {
      setLoginMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // INSCRIPTION
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

      // Connexion automatique après inscription
      setTimeout(async () => {
        await loginUser({
          email: data.email,
          password: data.password,
        });
        navigate("/profile-2"); 
      }, 1500);
    } catch (error: any) {
      setSignupMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion du changement de pays
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setValue("country", country);
    setValue("city", ""); // Réinitialise la ville quand le pays change
  };

  const password = watch("password");

  return (
    <div className="page-container">
      {/* FORMULAIRE D'INSCRIPTION */}
      <div className="panel panel-left">
        <p className="form-title">NOUVEAU CLIENT ? INSCRIVEZ-VOUS</p>
        <p className="form-subtitle">
          Créez votre compte en quelques secondes.
        </p>
        
        {signupMessage && (
          <p className={signupMessage.includes("réussie") ? "success-message" : "auth-error"}>
            {signupMessage}
          </p>
        )}

        <form className="register-form" onSubmit={handleSignup(onSignup)}>
          <div className="input-row">
            <div className="input-group">
              <label>Nom</label>
              <input
                {...registerSignup("nom", { required: "Le nom est requis" })}
                placeholder="Votre nom"
                type="text"
              />
              {signupErrors.nom && (
                <p className="auth-error">{signupErrors.nom.message}</p>
              )}
            </div>
            <div className="input-group">
              <label>Prénom</label>
              <input
                {...registerSignup("prenom", {
                  required: "Le prénom est requis",
                })}
                placeholder="Votre prénom"
                type="text"
              />
              {signupErrors.prenom && (
                <p className="auth-error">{signupErrors.prenom.message}</p>
              )}
            </div>
          </div>

          <label>Email</label>
          <input
            {...registerSignup("email", {
              required: "L'adresse email est requise",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email invalide",
              },
            })}
            placeholder="Votre adresse email"
            type="email"
          />
          {signupErrors.email && (
            <p className="auth-error">{signupErrors.email.message}</p>
          )}

          {/* CHAMPS PAYS ET VILLE */}
          <div className="input-row">
            <div className="input-group">
              <label>Pays</label>
              <select
                {...registerSignup("country", { required: "Le pays est requis" })}
                onChange={handleCountryChange}
                value={selectedCountry}
              >
                <option value="">Pays</option>
                {Object.keys(COUNTRIES_CITIES).map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {signupErrors.country && (
                <p className="auth-error">{signupErrors.country.message}</p>
              )}
            </div>
            <div className="input-group">
              <label>Ville</label>
              <select
                {...registerSignup("city", { required: "La ville est requise" })}
                disabled={!selectedCountry}
              >
                <option value="">Ville</option>
                {selectedCountry && COUNTRIES_CITIES[selectedCountry]?.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {signupErrors.city && (
                <p className="auth-error">{signupErrors.city.message}</p>
              )}
            </div>
          </div>

          <label>Mot de passe</label>
          <input
            {...registerSignup("password", {
              required: "Le mot de passe est requis",
              minLength: {
                value: 8,
                message: "Le mot de passe doit contenir au moins 8 caractères",
              },
              validate: {
                hasUpperCase: (value) =>
                  /[A-Z]/.test(value) || "Le mot de passe doit contenir au moins une majuscule",
                hasLowerCase: (value) =>
                  /[a-z]/.test(value) || "Le mot de passe doit contenir au moins une minuscule",
                hasNumber: (value) =>
                  /[0-9]/.test(value) || "Le mot de passe doit contenir au moins un chiffre",
                hasSpecialChar: (value) =>
                  /[@#$%^&+=!?*]/.test(value) ||
                  "Le mot de passe doit contenir au moins un caractère spécial (@#$%^&+=!?*)",
              },
            })}
            placeholder="Votre mot de passe"
            type="password"
          />
          {signupErrors.password && (
            <p className="auth-error">{signupErrors.password.message}</p>
          )}

          <label>Confirmation du mot de passe</label>
          <input
            {...registerSignup("confirmPassword", {
              required: "Veuillez confirmer votre mot de passe",
              validate: (value) =>
                value === password || "Les mots de passe ne correspondent pas",
            })}
            placeholder="Confirmez votre mot de passe"
            type="password"
          />
          {signupErrors.confirmPassword && (
            <p className="auth-error">{signupErrors.confirmPassword.message}</p>
          )}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Chargement..." : "Créer mon compte"}
          </button>
        </form>
      </div>

      {/* SÉPARATEUR */}
      <div className="divider">
        <div className="divider-line" />
        <span className="divider-label">ou</span>
        <div className="divider-line" />
      </div>

      {/* FORMULAIRE DE CONNEXION */}
      <div className="panel panel-right">
        <p className="form-title">DÉJÀ CLIENT ? CONNECTEZ-VOUS</p>
        <p className="form-subtitle">
          Connectez-vous avec votre adresse mail et votre mot de passe.
        </p>

        {loginMessage && (
          <p className={loginMessage.includes("réussie") ? "success-message" : "auth-error"}>
            {loginMessage}
          </p>
        )}

        <form className="login-form" onSubmit={handleLogin(onLogin)}>
          <label>Email</label>
          <input
            {...registerLogin("email", {
              required: "L'adresse email est requise",
            })}
            placeholder="Votre email"
            type="email"
          />
          {loginErrors.email && (
            <p className="auth-error">{loginErrors.email.message}</p>
          )}

          <label>Password</label>
          <input
            {...registerLogin("password", {
              required: "Le mot de passe est requis",
            })}
            placeholder="Votre mot de passe"
            type="password"
          />
          {loginErrors.password && (
            <p className="auth-error">{loginErrors.password.message}</p>
          )}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
};