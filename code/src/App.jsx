import React from "react";
import { ErrorBoundary } from 'react-error-boundary';
import Routes from "./Routes";
import { AuthProvider } from './contexts/AuthContext';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-4">
          Đã xảy ra lỗi
        </h1>
        <p className="text-text-secondary mb-4">
          {error?.message}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-700"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;