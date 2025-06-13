import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import rejestracjaService from "../services/rejestracja.service";


const Register = () => {

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");  const emailInputHandler = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(ev.target.value);
  }
  const nameInputHandler = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    setName(ev.target.value);
  }
  const passwordInputHandler = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(ev.target.value);
  }
  const confirmPasswordInputHandler = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(ev.target.value);
  }  
  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };
  const submitHandler = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    try {
      // Walidacja podstawowa - sprawdź czy wszystkie pola są wypełnione
      if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
        alert("Wszystkie pola muszą być wypełnione");
        return;
      }
      
      if (password !== confirmPassword) {
        alert("Hasła nie są zgodne");
        return;
      }
      const response = await rejestracjaService.create({
        name: name,
        email: email,
        password_hash: password,
      });
      if (response.status === 201) {
        alert("Rejestracja przebiegła pomyślnie");
        resetForm();
      } 
    else if (response.status === 409) {
        console.error("Użytkownik o podanym adresie e-mail już istnieje");
        alert("Użytkownik o podanym adresie e-mail już istnieje");
      } else {
        console.error("Błąd rejestracji");
        alert("Błąd rejestracji - sprawdź konsolę");
      }
    } catch (error) {
      console.error("Błąd rejestracji", error);
      alert("Błąd rejestracji - sprawdź konsolę");
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
            Zarejestruj się w HikeUp
          </h1>
          <form onSubmit={submitHandler} className="flex flex-col space-y-4">
            <input
              type="text"
              id="name"
              value={name}
              onInput={nameInputHandler}
              placeholder="Nazwa użytkownika"
              required
              minLength={3}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              id="email"
              value={email}
              minLength={3}
              onInput={emailInputHandler}
              placeholder="Email"
              required
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
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              minLength={3}
              onInput={confirmPasswordInputHandler}
              required
              placeholder="Potwierdź hasło"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
              Zarejestruj się
            </button>
            <p className="text-sm text-gray-700">
              Masz już konto?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
                Zaloguj się
              </a>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};
export default Register;
