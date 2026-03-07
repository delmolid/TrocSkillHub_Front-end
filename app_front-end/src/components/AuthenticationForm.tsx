import { useForm } from "react-hook-form";

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
    <form onSubmit={onSubmit}>
      <label>Email</label>
      <input
        {...register("email", { required: "L'adresse email est requis" })}
        placeholder="Email"
        type="email"
      />
      {errors.email && <p>{errors.email.message}</p>}
      <label>Password</label>
      <input
        {...register("password", { required: "Le mot de passe est requis" })}
        type="password"
      />
      <button type="submit">se connecter</button>
    </form>
  );
};
