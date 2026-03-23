import { useForm } from "react-hook-form";
import "./AuthenticationForm.css";

type FormFields = {
  email: string;
  password: string;
};

type eventForm = React.FormEventHandler<HTMLFormElement>;
export const AuthentificationForm: eventForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();
  const onSubmit = handleSubmit((data) => console.log(data));

  return (
    <div className="page-container">
      <div className="panel panel-right">
        <p className="form-title ">DÉJÀ CLIENT ? CONNECTEZ-VOUS</p>
        <p className=".form-subtitle ">
          Connectez-vous avec votre adresse mail et votre mot de passe.
        </p>
        <form className="login-form" onSubmit={onSubmit}>
          <label>Email</label>
          <input
            {...register("email", { required: "L'adresse email est requis" })}
            placeholder="votre email"
            type="email"
          />
          {errors.email && <p>{errors.email.message}</p>}
          <label>Password</label>
          <input
            {...register("password", {
              required: "Le mot de passe est requis",
            })}
            placeholder="votre mot de passe"
            type="password"
          />
          <button type="submit">se connecter</button>
        </form>
      </div>
    </div>
  );
};
