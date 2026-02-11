import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link. No token provided.");
      return;
    }

    const verify = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_URL || "/api";
        const res = await axios.get(`${baseURL}/auth/verify-email?token=${token}`);
        setStatus("success");
        setMessage(res.data.message);
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Verification failed. The link may be expired.");
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-[#f5f5f7] dark:bg-[#1c1c1e] p-8 rounded-2xl text-center">
          {status === "verifying" && (
            <>
              <div className="w-16 h-16 bg-[#0071e3]/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <svg className="w-8 h-8 text-[#0071e3]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-[19px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Verifying your email...</h2>
              <p className="text-[14px] text-[#86868b]">Please wait while we verify your account.</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 bg-[#30d158]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#30d158]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-[19px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Email Verified!</h2>
              <p className="text-[14px] text-[#86868b] mb-6">{message}</p>
              <Link to="/login" className="inline-block bg-[#0071e3] text-white py-2.5 px-8 rounded-full text-[14px] font-medium hover:bg-[#0077ed] transition-colors">
                Sign In
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 bg-[#ff453a]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#ff453a]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-[19px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Verification Failed</h2>
              <p className="text-[14px] text-[#86868b] mb-6">{message}</p>
              <Link to="/login" className="inline-block bg-[#0071e3] text-white py-2.5 px-8 rounded-full text-[14px] font-medium hover:bg-[#0077ed] transition-colors">
                Go to Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
