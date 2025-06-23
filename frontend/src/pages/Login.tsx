import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEnvelope,
  faLock,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import logowanieService from "../services/logowanie.service";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailInputHandler = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(ev.target.value);
  };
  const passwordInputHandler = async (
    ev: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPassword(ev.target.value);
  };
  const resetForm = () => {
    setEmail("");
    setPassword("");
  };
  const submitHandler = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    try {
      if (!email.trim() || !password.trim()) {
        alert("Wszystkie pola muszą być wypełnione");
        return;
      }
      const response = await logowanieService.create({
        email: email,
        password: password,
      });
      if (response.status === 200) {
        navigate("/");
        alert("Logowanie przebiegło pomyślnie");
        resetForm();
      } else if (response.status === 401) {
        console.error("Nieprawidłowy e-mail lub hasło");
        alert("Nieprawidłowy e-mail lub hasło");
      } else if (response.status === 404) {
        console.error("Użytkownik nie został znaleziony");
        alert("Użytkownik nie został znaleziony");
      } else {
        console.error("Błąd logowania");
        alert("Błąd logowania - sprawdź konsolę");
      }
    } catch (error) {
      console.error("Błąd podczas logowania:", error);
      alert("Wystąpił błąd podczas logowania - sprawdź konsolę");
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[url('/assets/img/IMG_4048.JPG')] bg-cover bg-center ">
      <a
        href="/"
        className="absolute top-4 left-4 text-black text-lg flex items-center hover:underline z-20 "
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Powrót do strony głównej
      </a>

      <main className="absolute inset-0 flex justify-end z-10">
        <div className="w-1/2 h-full flex items-center justify-center bg-white/20 backdrop-blur-sm p-8">
          <div className="rounded-lg p-8 max-w-xl w-full text-center">
            <h1 className="text-4xl sm:text-6xl font-lora mb-6 text-white justify-start flex ">
              Zaloguj się
            </h1>
            <form onSubmit={submitHandler} className="flex flex-col space-y-4">
              <div className="relative border-b-2 border-white">
                <input
                  type="email"
                  id="email"
                  value={email}
                  minLength={3}
                  onInput={emailInputHandler}
                  required
                  placeholder="E-mail"
                  className="w-full py-4 pr-10 pl-4 rounded-lg border-none bg-transparent placeholder-white text-white focus:outline-none focus:ring-0"
                />
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-lg pointer-events-none"
                />
              </div>

              <div className="relative border-b-2 border-white">
                <input
                  type="password"
                  id="password"
                  value={password}
                  minLength={3}
                  onInput={passwordInputHandler}
                  required
                  placeholder="Hasło"
                  className="w-full py-4 px-4 rounded-lg border-none bg-transparent placeholder-white text-white focus:outline-none focus:ring-0"
                />
                <FontAwesomeIcon
                  icon={faLock}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-lg pointer-events-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 w-full">
                <button
                  type="submit"
                  className="flex-1 relative bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 text-base font-medium text-center"
                >
                  Zaloguj się
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  />
                </button>
                <a
                  href="/register"
                  className="flex-1 px-6 py-3 rounded-lg border border-white text-white hover:bg-white hover:text-blue-500 transition duration-300 text-base font-medium text-center flex items-center justify-center"
                >
                  Zarejestruj się
                </a>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
export default Login;
