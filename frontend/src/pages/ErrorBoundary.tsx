import { Link, useRouteError } from "react-router-dom";

const ErrorBoundary = () => {
  const error = useRouteError();

  console.error(error);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-grad1 to-grad2 pb-24 md:pb-0 ">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-red-600">500</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mt-4">
          Wystąpił błąd aplikacji
        </h2>
        <Link
          to="/"
          className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Wróć na stronę główną
        </Link>
      </div>
    </div>
  );
};

export default ErrorBoundary;
