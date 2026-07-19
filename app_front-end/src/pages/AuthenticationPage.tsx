import { AuthentificationForm } from "../components/AuthenticationForm";
import { Header } from "../components/commons/Header";
import { Footer } from "../components/commons/Footer";

export const AuthentificationPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <AuthentificationForm />
      <Footer />
    </div>
  );
};
