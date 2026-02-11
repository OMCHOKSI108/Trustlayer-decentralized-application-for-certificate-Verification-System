import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";
import { AUTH_MESSAGES } from "../constants/text";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNeedsVerification(false);
    try {
      const data = await login(email, password);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      if (error.response?.data?.needsVerification) {
        setNeedsVerification(true);
      }
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await api.post("/auth/resend-verification", { email });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend email");
    }
  };

  return (
    <AuthLayout title={AUTH_MESSAGES.welcomeBack} subtitle={AUTH_MESSAGES.signInPrompt}>
      <div className="mb-8">
        <h2 className="text-[28px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">Sign in</h2>
        <p className="text-[15px] text-[#86868b] mt-1">Enter your credentials to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 border border-[#d2d2d7] dark:border-[#38383a] rounded-lg text-[14px] bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:border-[#0071e3] transition-colors"
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 border border-[#d2d2d7] dark:border-[#38383a] rounded-lg text-[14px] bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:border-[#0071e3] transition-colors"
          />
        </div>

        {needsVerification && (
          <div className="flex items-start gap-2.5 text-[12px] text-[#ff9f0a] bg-[#ff9f0a]/10 p-3 rounded-xl border border-[#ff9f0a]/20">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <span>Your email is not verified. Check your inbox for the verification link.</span>
              <button type="button" onClick={handleResend} className="block mt-1 font-medium underline hover:no-underline">
                Resend verification email
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0071e3] text-white py-2.5 rounded-full text-[15px] font-medium hover:bg-[#0077ed] disabled:opacity-50 transition-colors"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-[13px] text-center text-[#86868b] mt-6">
        Don't have an account?{" "}
        <Link to="/register" className="text-[#0071e3] font-medium hover:underline">
          Register
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
