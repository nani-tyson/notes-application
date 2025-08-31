import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";

const RESEND_SECONDS = 30;

export default function Signup() {
  const [form, setForm] = useState({ name: "", dob: "", email: "" });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLeft, setResendLeft] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!resendLeft) return;
    const id = setInterval(
      () => setResendLeft((s) => Math.max(0, s - 1)),
      1000
    );
    return () => clearInterval(id);
  }, [resendLeft]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const canSendOtp = useMemo(() => {
    return (
      form.name.trim().length >= 2 &&
      !!form.dob &&
      /\S+@\S+\.\S+/.test(form.email.trim()) &&
      !loading &&
      !otpSent
    );
  }, [form, loading, otpSent]);

  const canVerify = useMemo(() => {
    return otpSent && otp.trim().length > 0 && !loading;
  }, [otpSent, otp, loading]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (!canSendOtp) return;
    setLoading(true);
    try {
      await API.post("/users/signup", {
        ...form,
        email: form.email.trim(),
        name: form.name.trim(),
      });
      setOtpSent(true);
      setResendLeft(RESEND_SECONDS);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!canVerify) return;
    setLoading(true);
    try {
      const { data } = await API.post("/users/verify-otp", {
        email: form.email.trim(),
        otp: otp.trim(),
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/notes");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendLeft > 0) return;
    setError("");
    setLoading(true);
    try {
      await API.post("/users/signup", {
        ...form,
        email: form.email.trim(),
        name: form.name.trim(),
      });
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

          <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
            Sign up
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Sign up to enjoy the features of HD Notes
          </p>

          {error && (
            <p className="text-red-500 text-sm mb-4" role="alert">
              {error}
            </p>
          )}

          <form
            onSubmit={otpSent ? handleVerifyOtp : handleSignup}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Your Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Jonas Kahnwald"
                value={form.name}
                onChange={handleChange}
                disabled={otpSent}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                disabled={otpSent}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

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
                placeholder="name@example.com"
                value={form.email}
                onChange={handleChange}
                disabled={otpSent}
                autoComplete="email"
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {otpSent && (
              <>
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
                    className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading || resendLeft > 0}
                  className={`text-blue-500 text-sm ${
                    resendLeft === 0
                      ? "hover:underline"
                      : "opacity-60 cursor-not-allowed"
                  }`}
                >
                  {resendLeft > 0
                    ? `Resend OTP in ${resendLeft}s`
                    : "Resend OTP"}
                </button>
              </>
            )}

            <button
              type="submit"
              disabled={otpSent ? !canVerify : !canSendOtp}
              className={`w-full py-2 text-white rounded-lg ${
                otpSent
                  ? canVerify
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-green-400 cursor-not-allowed"
                  : canSendOtp
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-blue-400 cursor-not-allowed"
              }`}
            >
              {loading
                ? otpSent
                  ? "Verifying..."
                  : "Sending OTP..."
                : otpSent
                ? "Verify OTP"
                : "Get OTP"}
            </button>

            {!otpSent && (
              <p className="text-sm text-gray-500 text-center">
                Already have an account?{" "}
                <Link to="/signin" className="text-blue-500 hover:underline">
                  Sign in
                </Link>
              </p>
            )}
          </form>
        </div>
      </div>

      <div className="hidden lg:flex flex-1">
        <img
          src="/bg.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
