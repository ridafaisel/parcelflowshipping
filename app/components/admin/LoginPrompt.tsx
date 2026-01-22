interface LoginPromptProps {
  onGoToLogin: () => void;
  onClearSession: () => void;
}

export default function LoginPrompt({ onGoToLogin, onClearSession }: LoginPromptProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg border max-w-md w-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">!</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">You need to login to access the admin dashboard.</p>
          <div className="space-y-3">
            <button
              onClick={onGoToLogin}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Go to Login Page
            </button>
            <button
              onClick={onClearSession}
              className="w-full border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Clear Session & Retry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
