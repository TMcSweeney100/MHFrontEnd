import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doSignInwithEmailAndPassword } from "../firebase/auth";
import logo from "../../Images/maynoothMHLogo.png"


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Redirect after login



  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors

    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInwithEmailAndPassword(email, password);
        console.log("User signed in successfully");
        navigate("/dashboard"); // Redirect to dashboard or home
      } catch (error) {
        setErrorMessage("Invalid email or password.");
        console.error(error.message);
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  return (
  <div className="min-h-screen flex bg-white-100">
    {/* Left panel: small card for logo + description */}
    <div className="hidden md:flex w-1/2 items-start justify-center p-8">
      <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
        <img
          src={logo}
          alt="Maynooth Mental Health Logo"
          className="w-70 h-auto mb-20"
        />
        <p className="text-center text-gray-1000">
          Maynooth Mental Health is a free, student-focused app to help you track your mood, build healthy habits, and connect with support resources.
        </p>
      </div>
    </div>
    {/* Right panel: the form */}
    <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-100">
      <main className="w-full max-w-md bg-white rounded-lg shadow-md p-8 mx-4">
        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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

          {/* Sign In button */}
          <button
            type="submit"
            disabled={isSigningIn}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSigningIn ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline"
          >
            Register
          </button>
        </p>
      </main>
    </div>
  </div>
);
};

export default Login;
