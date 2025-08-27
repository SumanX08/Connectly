import  { useState } from "react";
import useAuthStore from "../../Stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import { Link } from "react-router-dom";
import { API_URL } from "../config";
import { toast } from 'sonner'



const AuthForm = () => {

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.email || !form.password || (!isLogin && !form.confirmPassword)) {
    return toast.error("All fields are required!");
  }
  if (!/\S+@\S+\.\S+/.test(form.email)) {
    return toast.error("Please enter a valid email address!");
  }
  if (!isLogin) {
    if (form.password.length < 8) {
      return toast.error("Password must be at least 8 characters long!");
    }
    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
  }

  const url = isLogin
    ? `${API_URL}/api/auth/login`
    : `${API_URL}/api/auth/signup`;

  const payload = { 
    email: form.email, 
    password: form.password,
    ...( !isLogin && { confirmPassword: form.confirmPassword })
  };

  try {
    await toast.promise(
      axios.post(url, payload),
      {
        loading: isLogin ? "Signing you in..." : "Creating your account...",
        success: (res) => {
          const { token, user } = res.data;
          setUser(user, token);
          isLogin ? navigate("/home") : navigate("/profileSetup");
          return isLogin ? "Welcome back " : "Account created ";
        },
        error: (err) =>
          err.response?.data?.message || "Authentication failed. Please try again."
      }
    );
  } catch (err) {
    console.error("Auth failed:", err);
  }
};




  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-zinc-900 rounded-xl shadow-md w-full max-w-md py-6 px-3 md:p-8 text-white">
        <h1 className="text-3xl font-medium text-center mb-5">Connectly</h1>
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Sign in to your account" : "Create your account"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm mb-1">Email address</label>
            <input
              name="email"
              onChange={handleChange}
              type="email"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              name="password"
              onChange={handleChange}
              type="password"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {isLogin ? (
            <div className="flex justify-between items-center text-sm">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" className="accent-blue-500" />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-blue-400 hover:underline text-sm"
              >
                Forgot password?
              </Link>
            </div>
          ) : (
            <div>
              <label className="block text-sm mb-1">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={handleChange}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition cursor-pointer"
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6 text-sm text-zinc-500">
          <hr className="flex-grow border-zinc-700" />
          or continue with
          <hr className="flex-grow border-zinc-700" />
        </div>

        <a href= {`${API_URL}/api/auth/google`} className="w-full bg-white text-black font-semibold flex items-center justify-center py-2 rounded hover:bg-zinc-200 transition">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
          Google
        </a>

        <div className="text-center mt-6 text-sm text-zinc-400">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button
                className="text-blue-400 hover:underline"
                onClick={() => setIsLogin(false)}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="text-blue-400 hover:underline"
                onClick={() => setIsLogin(true)}
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};



export default AuthForm;
