import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import logowanieService from "../services/logowanie.service";

const Login = () => {
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
    } 
    catch (error) {
      console.error("Błąd podczas logowania:", error);
      alert("Wystąpił błąd podczas logowania - sprawdź konsolę");
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[url('/assets/img/FullSizeRender.JPG')] bg-cover bg-center ">
      <a
        href="/"
        className="absolute top-4 left-4 text-black text-lg flex items-center hover:underline z-20 "
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Powrót do strony głównej
      </a>
      <main className="absolute inset-0 flex items-center justify-center z-10 p-4">
        <div className="bg-white/60 rounded-lg shadow-lg p-8 max-w-2xl w-full text-center">
          <h1 className="text-4xl sm:text-5xl font-lora mb-6 text-gray-800">
            Zaloguj się do HikeUp
          </h1>
          <form onSubmit={submitHandler} className="flex flex-col space-y-4">
            <input
              type="email"
              id="email"
              value={email}
              minLength={3}
              onInput={emailInputHandler}
              required
              placeholder="email"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              id="password"
              value={password}
              minLength={3}
              onInput={passwordInputHandler}
              required
              placeholder="Hasło"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
              Zaloguj się
            </button>
            <p className="text-sm text-gray-700">
              Nie masz konta?{" "}
              <a href="/register" className="text-blue-500 hover:underline">
                Zarejestruj się
              </a>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};
export default Login;
