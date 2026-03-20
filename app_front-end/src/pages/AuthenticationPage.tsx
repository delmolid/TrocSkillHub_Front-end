import { AuthentificationForm } from "../components/AuthenticationForm";
import { Header } from "../components/commons/Header";

export const AuthentificationPage: React.FC = () => {
  return (
    <>
      <div>
        <Header />
        <AuthentificationForm />
      </div>
    </>
  );
};
