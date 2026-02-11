import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";

const ForgotPassword = () => {
    const [step, setStep] = useState("email"); // email | otp | done
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const inputClasses = "w-full px-3.5 py-2.5 border border-[#d2d2d7] dark:border-[#38383a] rounded-lg text-[14px] bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:border-[#0071e3] transition-colors";

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/auth/forgot-password", { email });
            toast.success(res.data.message);
            setStep("otp");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        setLoading(true);
        try {
            const res = await api.post("/auth/reset-password", { email, otp, newPassword });
            toast.success(res.data.message);
            setStep("done");
        } catch (error) {
            toast.error(error.response?.data?.message || "Reset failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Reset Password" subtitle="We'll help you get back in">
            {step === "email" && (
                <>
                    <div className="mb-6">
                        <h2 className="text-[28px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">Forgot password?</h2>
                        <p className="text-[15px] text-[#86868b] mt-1">Enter your email and we'll send you a verification code.</p>
                    </div>

                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <div>
                            <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClasses} placeholder="you@example.com" />
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-[#0071e3] text-white py-2.5 rounded-full text-[15px] font-medium hover:bg-[#0077ed] disabled:opacity-50 transition-colors">
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </form>

                    <p className="text-[13px] text-center text-[#86868b] mt-6">
                        Remember your password?{" "}
                        <Link to="/login" className="text-[#0071e3] font-medium hover:underline">Sign In</Link>
                    </p>
                </>
            )}

            {step === "otp" && (
                <>
                    <div className="mb-6">
                        <h2 className="text-[28px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">Enter OTP</h2>
                        <p className="text-[15px] text-[#86868b] mt-1">
                            We sent a 6-digit code to <span className="text-[#1d1d1f] dark:text-[#f5f5f7] font-medium">{email}</span>
                        </p>
                    </div>

                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div>
                            <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">Verification Code</label>
                            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6} placeholder="000000" className={`${inputClasses} text-center text-[20px] tracking-[8px] font-semibold`} />
                        </div>
                        <div>
                            <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">New Password</label>
                            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} className={inputClasses} placeholder="At least 6 characters" />
                        </div>
                        <div>
                            <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">Confirm Password</label>
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} className={inputClasses} placeholder="Re-enter password" />
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-[#0071e3] text-white py-2.5 rounded-full text-[15px] font-medium hover:bg-[#0077ed] disabled:opacity-50 transition-colors">
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>

                    <div className="flex items-center justify-between mt-4">
                        <button onClick={() => setStep("email")} className="text-[13px] text-[#0071e3] font-medium hover:underline">
                            ← Change email
                        </button>
                        <button onClick={handleSendOtp} className="text-[13px] text-[#0071e3] font-medium hover:underline">
                            Resend OTP
                        </button>
                    </div>
                </>
            )}

            {step === "done" && (
                <div className="text-center">
                    <div className="w-16 h-16 bg-[#30d158]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-[#30d158]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-[22px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Password Reset!</h2>
                    <p className="text-[14px] text-[#86868b] mb-6">Your password has been updated successfully.</p>
                    <Link to="/login" className="inline-block bg-[#0071e3] text-white py-2.5 px-8 rounded-full text-[14px] font-medium hover:bg-[#0077ed] transition-colors">
                        Sign In
                    </Link>
                </div>
            )}
        </AuthLayout>
    );
};

export default ForgotPassword;
