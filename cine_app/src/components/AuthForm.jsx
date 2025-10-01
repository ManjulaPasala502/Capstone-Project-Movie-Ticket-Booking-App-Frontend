import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig.js";
import { useNavigate } from 'react-router-dom';
import googleLogo from '../assets/google.svg';
import { EyeOff, Eye, Check } from 'lucide-react';


const AuthForm = ({ onClose, isOpen }) => {
  const { login, signup, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate()
  // const { setUser } = useContext(AuthContext)
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user', // default role
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState('');


  const isSignup = !isLogin;


  useEffect(() => {
    if (formData.role !== 'user') {
      setIsLogin(true);
    }
  }, [formData.role]);

  const validate = () => {
    const errors = {};


    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }


    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (isSignup && formData.role === 'user' && !formData.name.trim()) {
      errors.name = 'Name is required';
    }

    setFieldErrors(errors);


    return Object.keys(errors).length === 0;
  };



  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setFieldErrors(prevErrors => ({
      ...prevErrors,
      [e.target.name]: '',
    }));

    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setTermsError('You must accept the Terms & Conditions');
      return;
    } else {
      setError('')
    }
    if (!validate()) {
      return;
    }
    setLoading(true);
    setError('');
    setFieldErrors({})


    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
        const savedUser = JSON.parse(localStorage.getItem("user"));

        if (savedUser?.role === "admin") {
          navigate("/admin/dashboard");
        } else if (savedUser?.role === "owner") {
          navigate("/owner/dashboard");
        } else {
          navigate("/");
        }
        onClose();
      }
      else {
        await signup({ name: formData.name, email: formData.email, password: formData.password, role: formData.role });
        setSuccessMsg('Signup successful! Please login.');
        setIsLogin(true);
      }

    } catch (err) {
      const backendErrors = err.response?.data?.errors;
      const backendMessage = err.response?.data?.message;

      if (backendErrors) {

        setFieldErrors(backendErrors);
      } else if (backendMessage) {

        setError(backendMessage);
      } else {
        setError('Authentication failed. Please try again.');
      }

    } finally {
      setLoading(false);
    }

  };
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // Switch to the redirect method
      await signInWithRedirect(auth, provider);
    } catch (error) {
      // Handle errors here
      console.error(error);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md sm:max-w-lg p-6 rounded-2xl shadow-lg border border-pink-500">

        {/* Only show tabs if role is 'user' */}
        {formData.role === 'user' && (
          <div className="flex justify-between mb-6 border-b border-pink-500">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 ${isLogin ? "border-b-2 border-pink-500 text-pink-900 font-bold" : "text-cyan-700"}`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 ${!isLogin ? "border-b-2 border-pink-500 text-pink-900 font-semibold" : "text-cyan-700"}`}
            >
              Signup
            </button>
          </div>
        )}

        {error && <div className="text-red-600 mb-4">{error}</div>}
        {/* {successMsg && <div className="text-green-600 mb-4">{successMsg}</div>} */}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name only shown for signup and role=user */}
          {isSignup && formData.role === 'user' && (
            <div>
              <label htmlFor="name" className="block mb-1 font-medium text-pink-900">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-pink-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-pink-900">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-pink-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className='relative'>
            <label htmlFor="password" className="block mb-1 font-medium text-pink-900">
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : 'password'}
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-pink-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[39px] text-pink-500"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Role selection dropdown */}
          <div>
            <label htmlFor="role" className="block mb-1 font-medium text-pink-900">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-pink-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="owner">Theater Owner</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-pink-500 text-white py-2 rounded-lg font-semibold hover:bg-pink-600 transition ${loading ? 'opacity-50' : ''}`}
          >
            {loading
              ? (isSignup ? "Signing up..." : "Logging in...")
              : (isSignup ? "Signup" : "Login")}
          </button>
          <div className="flex items-center gap-2">
            <label className="relative flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={() => {
                  setAcceptedTerms(!acceptedTerms);
                  if (termsError) setTermsError('');
                }}
                className="sr-only"
              />
              <div className={`w-5 h-5 border-2 border-pink-500 rounded-sm flex items-center justify-center ${acceptedTerms ? 'bg-pink-500' : 'bg-white'
                }`}>
                {acceptedTerms && <Check className="text-white" size={16} />}
              </div>
              <span className="ml-2 text-pink-900 text-sm">
                I accept the <a href="/terms" className="underline">Terms & Conditions</a>
              </span>
            </label>
          </div>
        </form>

        <div className="flex items-center my-4">
          <hr className="flex-1 border-gray-300" />
          <span className="px-2 text-gray-500">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 border border-pink-500 py-2 rounded-lg text-pink-500 font-semibold hover:bg-pink-500 hover:text-white transition"
        >
          <img
            src={googleLogo}
            alt="google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <button
          onClick={() => {
            console.log('Cancel clicked');
            onClose();
          }}

          className="mt-4 w-full text-sm text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
