import { useForm } from "react-hook-form";
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
};

export const AuthentificationForm: React.FC = () => {
  const {
    register: registerLogin,
    handleSubmit: handleLogin,
    formState: { errors: loginErrors },
  } = useForm<LoginFields>();

  const {
    register: registerSignup,
    handleSubmit: handleSignup,
    watch,
    formState: { errors: signupErrors },
  } = useForm<RegisterFields>();

  const onLogin = handleLogin((data) => console.log("Login:", data));
  const onSignup = handleSignup((data) => console.log("Signup:", data));

  const password = watch("password");

  return (
    <div className="page-container">
      {/* Formulaire d'inscription — gauche */}
      <div className="panel panel-left">
        <p className="form-title">NOUVEAU CLIENT ? INSCRIVEZ-VOUS</p>
        <p className="form-subtitle">
          Créez votre compte en quelques secondes.
        </p>
        <form className="register-form" onSubmit={onSignup}>
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

          <label>Mot de passe</label>
          <input
            {...registerSignup("password", {
              required: "Le mot de passe est requis",
              minLength: {
                value: 8,
                message: "Minimum 8 caractères",
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

          <button type="submit">Créer mon compte</button>
        </form>
      </div>

      {/* Séparateur vertical */}
      <div className="divider">
        <div className="divider-line" />
        <span className="divider-label">ou</span>
        <div className="divider-line" />
      </div>

      {/* Formulaire de connexion — droite */}
      <div className="panel panel-right">
        <p className="form-title">DÉJÀ CLIENT ? CONNECTEZ-VOUS</p>
        <p className="form-subtitle">
          Connectez-vous avec votre adresse mail et votre mot de passe.
        </p>
        <form className="login-form" onSubmit={onLogin}>
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

          <button type="submit">Se connecter</button>
        </form>
      </div>
    </div>
  );
};