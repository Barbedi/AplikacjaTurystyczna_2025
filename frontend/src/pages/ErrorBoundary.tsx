import { Link, useRouteError } from "react-router-dom";

const ErrorBoundary = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const error = useRouteError() as any;

  console.error("❌ Wystąpił błąd w aplikacji:", error);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-grad1 to-grad2 pb-24 md:pb-0 text-center text-gray-200">
      <div>
        <h1 className="text-9xl font-bold text-red-600">500</h1>
        <h2 className="text-2xl font-semibold mt-4">Wystąpił błąd aplikacji</h2>

        {/* 🔍 Szczegóły błędu – tylko do debugowania */}
        {error && (
          <div className="mt-6 bg-black/30 text-left mx-auto p-4 rounded-lg w-[90%] max-w-xl backdrop-blur-sm text-sm text-gray-100">
            <p>
              <strong>Typ błędu:</strong>{" "}
              {error.statusText || error.name || "Nieznany"}
            </p>
            <p>
              <strong>Wiadomość:</strong>{" "}
              {error.message || "Brak szczegółów błędu"}
            </p>
            {error.stack && (
              <details className="mt-2 whitespace-pre-wrap">
                <summary className="cursor-pointer text-blue-400">
                  Pokaż stack trace
                </summary>
                {error.stack}
              </details>
            )}
          </div>
        )}

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
