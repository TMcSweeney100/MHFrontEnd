import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword } from '../../firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsRegistering(true);
    try {
      await doCreateUserWithEmailAndPassword(email, password);
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsRegistering(false);
    }
  };

 return (
  <div className="min-h-screen flex bg-gray-100">
    {/* Left panel: Social Sign-in */}
    <div className="hidden md:flex w-1/2 bg-white items-center justify-center">
      <div className="space-y-4">
        <p className="text-lg font-medium text-gray-700 text-center">
          You can also sign in with:
        </p>
        <div>
        <button
          onClick={() => {}}
          className="w-64 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          <FontAwesomeIcon icon={["fab","facebook"]} size ="3x" className='mr-3'/>
          
        </button>
        </div>
        <div>
        <button
          onClick={() => {}}
          className="w-64 px-4 py-3 bg-blue-300 text-white font-semibold rounded-lg hover:bg-blue-400 transition"
        >
           <FontAwesomeIcon icon={["fab","twitter"]} size ="3x" className='mr-3'/>
        </button>
        </div>
        <div>
        <button
          onClick={() => {}}
          className="w-64 px-4 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
        >
          <FontAwesomeIcon icon={["fab","google"]} size ="3x" className='mr-3'/>
        </button>
        </div>
      </div>
    </div>

    {/* Right panel: Registration Form */}
    <div className="flex flex-1 items-center justify-center p-6">
      <main className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-4">
          Create a New Account
        </h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Come join our community! Already have one?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline"
          >
            Sign in here
          </button>
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Username (placeholder only) */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="johndoe"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Error message */}
          {errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}

          {/* Sign Up button */}
          <button
            type="submit"
            disabled={isRegistering}
            className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition disabled:opacity-50"
          >
            {isRegistering ? "Creating..." : "Join"}
          </button>
        </form>
      </main>
    </div>
  </div>
);

};

export default Register;
