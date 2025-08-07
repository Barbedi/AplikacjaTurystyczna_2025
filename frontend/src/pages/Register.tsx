import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faEnvelope,
  faLock,
  faChevronRight,
  faUser,
  faTriangleExclamation,
  faCircleExclamation,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import rejestracjaService from "../services/rejestracja.service";
import ToastModalContext from "../store/toast-modal-context";

const Register = () => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const { createToast } = React.useContext(ToastModalContext);

  const emailInputHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(ev.target.value);
  };
  const nameInputHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setName(ev.target.value);
  };
  const passwordInputHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(ev.target.value);
  };
  const confirmPasswordInputHandler = (
    ev: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(ev.target.value);
  };
  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };
  const submitHandler = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    try {
      if (
        !name.trim() ||
        !email.trim() ||
        !password.trim() ||
        !confirmPassword.trim()
      ) {
        createToast({
          message: "Wszystkie pola muszą być wypełnione",
          icon: faTriangleExclamation,
          type: "warning",
          timeout: 5000,
        });
        return;
      }

      if (password !== confirmPassword) {
        createToast({
          message: "Hasła nie są zgodne",
          icon: faTriangleExclamation,
          type: "warning",
          timeout: 5000,
        });
        return;
      }

      const response = await rejestracjaService.create({
        name,
        email,
        password,
      });

      if (response.status === 201) {
        createToast({
          message: "Rejestracja przebiegła pomyślnie",
          icon: faCircleCheck,
          type: "primary",
          timeout: 5000,
        });
        resetForm();
      }
    } catch (error: unknown) {
      console.error("Błąd rejestracji", error);

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 409) {
          createToast({
            message: "Użytkownik o podanym adresie e-mail już istnieje",
            icon: faTriangleExclamation,
            type: "warning",
            timeout: 5000,
          });
          return;
        }
      }

      createToast({
        message: "Błąd rejestracji - sprawdź konsolę",
        icon: faCircleExclamation,
        type: "danger",
        timeout: 5000,
      });
    }
  };

  return (
    <div className="relative w-full h-screen bg-[url('/assets/img/IMG_4048.webp')] bg-cover bg-center overflow-hidden">
      <a
        href="/"
        className="absolute top-5 left-5 text-white text-2xl flex items-center hover:underline z-20"
      >
        <FontAwesomeIcon icon={faCircleArrowLeft} className="mr-2" />
      </a>
      <div className="flex h-full z-10">
        <div className="hidden sm:flex flex-1 items-end px-6 sm:px-12 pb-[16vh] text-white">
          <div className="max-w-2xl break-words leading-relaxed">
            <h2 className="text-3xl sm:text-5xl font-lora mb-4">
              Witaj w serwisie
            </h2>
            <p className="text-xl sm:text-2xl">
              Dołącz do społeczności odkrywców górskich tras rejestracja zajmie
              chwilę!
            </p>
          </div>
        </div>
        <div className="w-full sm:flex-1 h-full flex items-center justify-center bg-white/20 backdrop-blur-sm p-8">
          <div className="rounded-lg p-8 max-w-xl w-full text-center">
            <h1 className="text-4xl sm:text-6xl font-lora mb-8 text-white text-left">
              Zarejestruj się
            </h1>
            <form onSubmit={submitHandler} className="flex flex-col space-y-6">
              <div className="relative border-b-2 border-white">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onInput={nameInputHandler}
                  placeholder="Nazwa użytkownika"
                  required
                  minLength={3}
                  className="w-full py-4 pr-10 pl-4 border-none bg-transparent placeholder-white text-white focus:outline-none"
                />
                <FontAwesomeIcon
                  icon={faUser}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-lg pointer-events-none"
                />
              </div>
              <div className="relative border-b-2 border-white">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onInput={emailInputHandler}
                  placeholder="E-mail"
                  required
                  minLength={3}
                  className="w-full py-4 pr-10 pl-4 border-none bg-transparent placeholder-white text-white focus:outline-none"
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
                  onInput={passwordInputHandler}
                  placeholder="Hasło"
                  required
                  minLength={3}
                  className="w-full py-4 pr-10 pl-4 border-none bg-transparent placeholder-white text-white focus:outline-none"
                />
                <FontAwesomeIcon
                  icon={faLock}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-lg pointer-events-none"
                />
              </div>
              <div className="relative border-b-2 border-white">
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onInput={confirmPasswordInputHandler}
                  placeholder="Potwierdź hasło"
                  required
                  minLength={3}
                  className="w-full py-4 pr-10 pl-4 border-none bg-transparent placeholder-white text-white focus:outline-none"
                />
                <FontAwesomeIcon
                  icon={faLock}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-lg pointer-events-none"
                />
              </div>
              <div className="flex flex-col sm:flex-row group sm:space-x-4 space-y-4 sm:space-y-0 w-full pt-2">
                <button
                  type="submit"
                  className="flex-1 relative bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 text-base font-medium"
                >
                  Zarejestruj się
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="absolute group-hover:translate-x-2 right-6 top-1/2 -translate-y-1/2 duration-300 transition-all"
                  />
                </button>
                <a
                  href="/login"
                  className="flex-1 px-6 py-3 rounded-lg  text-white hover:bg-white hover:text-blue-500 transition duration-300 text-base font-medium flex items-center justify-center"
                >
                  Zaloguj się
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
