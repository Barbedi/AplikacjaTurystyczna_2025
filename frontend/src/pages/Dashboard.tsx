import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../store/auth-context"; // lub odpowiednia ścieżka

const Dashboard = () => {
  const { checkAuth, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth().then((isAuth) => {
      console.log("Zalogowany?", isAuth); // true/false
      if (!isAuth) {
        navigate("/login"); // przekieruj jeśli nie zalogowany
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Sprawdzanie autoryzacji...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      <p className="text-lg">Welcome to the Dashboard!</p>
      {user && (
        <p className="mt-4 text-sm text-gray-600">
          Zalogowany jako: <strong>{user.email}</strong>
        </p>
      )}
    </div>
  );
};

export default Dashboard;
