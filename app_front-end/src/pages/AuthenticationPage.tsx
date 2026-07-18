import { AuthentificationForm } from "../components/AuthenticationForm";
import { Header } from "../components/commons/Header";
import { Footer } from "../components/commons/Footer";
import "../App.css";

export const AuthentificationPage: React.FC = () => {
  return (
    <div className="app">
      <Header />
      <AuthentificationForm />
      <Footer />
    </div>
  );
};
