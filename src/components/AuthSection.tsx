import React, { useState } from 'react';

type AuthSectionProps = {
  onLogin: () => void;
  onRegister: () => void;
};

const AuthSection: React.FC<AuthSectionProps> = ({ onLogin, onRegister }) => {
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and register

  return (
    <div className="p-4 border rounded shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">
        {isRegistering ? 'Register for an Account' : 'Welcome Back!'}
      </h2>
      <div className="flex flex-col space-y-4">
        {isRegistering ? (
          <>
            <button
              onClick={onRegister}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Register
            </button>
            <p className="text-sm text-center">
              Already have an account?{' '}
              <button
                onClick={() => setIsRegistering(false)}
                className="text-blue-500 underline"
              >
                Login here
              </button>
            </p>
          </>
        ) : (
          <>
            <button
              onClick={onLogin}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Login
            </button>
            <p className="text-sm text-center">
              Don't have an account?{' '}
              <button
                onClick={() => setIsRegistering(true)}
                className="text-green-500 underline"
              >
                Register here
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthSection;