import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";

const RESEND_SECONDS = 30;

export default function Signin() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLeft, setResendLeft] = useState(0);
  const canSubmit = useMemo(
    () =>
      /\S+@\S+\.\S+/.test(email.trim()) && otp.trim().length > 0 && !loading,
    [email, otp, loading]
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!resendLeft) return;
    const id = setInterval(
      () => setResendLeft((s) => Math.max(0, s - 1)),
      1000
    );
    return () => clearInterval(id);
  }, [resendLeft]);

  const handleSignin = async (e) => {
    e.preventDefault();
    setError("");
    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setError("Enter a valid email address");
      return;
    }
    if (!otp.trim()) {
      setError("Enter the OTP sent to email");
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post("/users/verify-otp", {
        email: email.trim(),
        otp: otp.trim(),
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/notes");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setError("Enter a valid email to receive OTP");
      return;
    }
    setLoading(true);
    try {
      await API.post("/users/signin", { email: email.trim() });
      setResendLeft(RESEND_SECONDS);
    } catch (err) {
      setError(err.response?.data?.message || "Error resending OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Desktop/LG brand – top-left corner */}
      <div className="hidden lg:flex items-center gap-2 absolute top-6 left-8 z-10">
        <img src="/image.png" alt="App Icon" className="w-8 h-8" />
        <span className="text-2xl font-bold text-gray-800">HD</span>
      </div>

      {/* Left/form column */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative">
        <div className="w-full max-w-md">
          {/* Mobile brand – centered above form */}
          <div className="flex items-center justify-center gap-2 mb-6 lg:hidden">
            <img src="/image.png" alt="App Icon" className="w-8 h-8" />
            <span className="text-2xl font-bold text-gray-800">HD</span>
          </div>

          <h1 className="text-3xl font-bold mb-2 text-center">Sign in</h1>
          <p className="text-gray-500 mb-6 text-center">
            Please login to continue to your account.
          </p>

          {error && (
            <p className="text-red-500 text-sm mb-4" role="alert">
              {error}
            </p>
          )}

          <form onSubmit={handleSignin} className="space-y-4">
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
                name="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                OTP
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && canSubmit) handleSignin(e);
                }}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={
                loading || resendLeft > 0 || !/\S+@\S+\.\S+/.test(email.trim())
              }
              className={`text-blue-500 text-sm ${
                resendLeft === 0
                  ? "hover:underline"
                  : "opacity-60 cursor-not-allowed"
              }`}
            >
              {resendLeft > 0 ? `Resend OTP in ${resendLeft}s` : "Resend OTP"}
            </button>

            <label className="flex items-center space-x-2 text-gray-600 text-sm">
              <input type="checkbox" className="h-4 w-4" />
              <span>Keep me logged in</span>
            </label>

            <button
              type="submit"
              disabled={!canSubmit}
              className={`w-full py-2 text-white rounded-lg ${
                canSubmit
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-green-400 cursor-not-allowed"
              }`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <p className="text-sm text-gray-500 text-center">
              Need an account?{" "}
              <Link to="/signup" className="text-blue-500 hover:underline">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex flex-1">
        <img
          src="/bg.jpg"
          alt="Background"
          className="w-full h-full object-cover rounded-l-2xl"
        />
      </div>
    </div>
  );
}
