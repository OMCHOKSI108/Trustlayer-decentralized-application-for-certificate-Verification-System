import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";
import { AUTH_MESSAGES } from "../constants/text";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    organization: "",
  });
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/register", formData);
      toast.success(res.data.message);
      setRegistered(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await api.post("/auth/resend-verification", { email: formData.email });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend email");
    }
  };

  const inputClasses = "w-full px-3.5 py-2.5 border border-[#d2d2d7] dark:border-[#38383a] rounded-lg text-[14px] bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:border-[#0071e3] transition-colors";

  return (
    <AuthLayout title={AUTH_MESSAGES.createAccount} subtitle={AUTH_MESSAGES.getStarted}>
      {registered ? (
        <div className="text-center">
          <div className="w-16 h-16 bg-[#30d158]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#30d158]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-[22px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">{AUTH_MESSAGES.checkEmail}</h2>
          <p className="text-[14px] text-[#86868b] mb-2">
            We've sent a verification link to
          </p>
          <p className="text-[14px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">{formData.email}</p>
          <p className="text-[12px] text-[#86868b] mb-6">
            Click the link in the email to verify your account. The link expires in 24 hours.
          </p>
          <button onClick={handleResend} className="text-[13px] text-[#0071e3] font-medium hover:underline">
            Didn't receive it? Resend email
          </button>
          <div className="mt-6">
            <Link to="/login" className="text-[13px] text-[#0071e3] font-medium hover:underline">
              Go to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-[28px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">Create account</h2>
            <p className="text-[15px] text-[#86868b] mt-1">Get started with TrustLayer</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClasses} />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClasses} />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} className={inputClasses} />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">I am a</label>
              <select name="role" value={formData.role} onChange={handleChange} className={inputClasses}>
                <option value="user">Employer / Verifier</option>
                <option value="university">University / Institution</option>
              </select>
            </div>

            {formData.role === "university" && (
              <UniversitySearch value={formData.organization} onChange={handleChange} />
            )}

            {formData.role === "university" && (
              <div className="flex items-start gap-2.5 text-[12px] text-[#ff9f0a] bg-[#ff9f0a]/10 p-3 rounded-xl border border-[#ff9f0a]/20">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>University accounts require admin approval before you can issue certificates.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0071e3] text-white py-2.5 rounded-full text-[15px] font-medium hover:bg-[#0077ed] disabled:opacity-50 transition-colors"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </>
      )}

      {!registered && (
        <p className="text-[13px] text-center text-[#86868b] mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[#0071e3] font-medium hover:underline">
            Sign In
          </Link>
        </p>
      )}
    </AuthLayout>
  );
};

// Sub-component for University Autocomplete
const UniversitySearch = ({ value, onChange }) => {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query && query.length > 2 && showDropdown && query !== value) {
        setIsSearching(true);
        try {
          const res = await api.get(`/universities/search?name=${query}`);
          setResults(res.data.results || []);
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setIsSearching(false);
        }
      } else if (!query) {
        setResults([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query, showDropdown, value]);

  const handleSelect = (uniName) => {
    setQuery(uniName);
    onChange({ target: { name: "organization", value: uniName } });
    setShowDropdown(false);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    onChange(e);
    setShowDropdown(true);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5">
        Organization / University Name
      </label>
      <div className="relative">
        <input
          type="text"
          name="organization"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          className="w-full px-3.5 py-2.5 border border-[#d2d2d7] dark:border-[#38383a] rounded-lg text-[14px] bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:border-[#0071e3] transition-colors"
          placeholder="Type to search (e.g., University of Delhi)"
          autoComplete="off"
          required
        />
        {isSearching && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin h-5 w-5 border-2 border-[#0071e3] rounded-full border-t-transparent"></div>
          </div>
        )}
      </div>

      {showDropdown && results.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white dark:bg-[#2c2c2e] border border-[#d2d2d7] dark:border-[#38383a] rounded-xl shadow-lg max-h-60 overflow-auto">
          {results.map((uni, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(uni.name)}
              className="px-4 py-2.5 hover:bg-[#f5f5f7] dark:hover:bg-[#38383a] cursor-pointer text-[13px] text-[#1d1d1f] dark:text-[#f5f5f7] border-b border-[#f5f5f7] dark:border-[#38383a] last:border-0"
            >
              <div className="font-medium">{uni.name}</div>
              <div className="text-[11px] text-[#86868b] flex justify-between mt-0.5">
                <span>{uni.state || "International"}</span>
                <span className="px-1.5 py-0.5 bg-[#f5f5f7] dark:bg-[#48484a] rounded text-[#86868b]">{uni.source === 'Hipolabs API' ? 'Global' : 'Verified'}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      {showDropdown && query.length > 2 && results.length === 0 && !isSearching && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-[#2c2c2e] border border-[#d2d2d7] dark:border-[#38383a] rounded-xl shadow-lg p-3 text-[13px] text-[#86868b]">
          No universities found. You can keep typing to use custom name.
        </div>
      )}
    </div>
  );
};

export default Register;
