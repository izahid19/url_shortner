import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "@/db/apiAuth";
import { BeatLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import Error from "./error";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: email, 2: otp + new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await forgotPassword({ email });
      toast.success("If an account exists, you will receive a reset code.");
      setStep(2);
      setCountdown(60);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await resetPassword({ email, otp, newPassword });
      toast.success("Password reset successfully!");
      navigate("/auth");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError(null);

    try {
      await forgotPassword({ email });
      toast.success("Reset code sent!");
      setCountdown(60);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <Card className="max-w-md w-full mx-auto p-4 sm:p-6 space-y-4">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-2xl">
            {step === 1 ? "Forgot Password" : "Reset Password"}
          </CardTitle>
          <CardDescription className="text-center text-sm text-gray-600">
            {step === 1
              ? "Enter your email to receive a reset code"
              : `Enter the code sent to ${email}`}
          </CardDescription>
          {error && <Error message={error} />}
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 ? (
            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Enter 6-digit OTP
                </label>
                <Input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full text-center text-2xl tracking-widest"
                  maxLength={6}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">New Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full"
                  />
                  <span
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full"
                />
              </div>
              <p className="text-sm text-gray-500 text-center">
                Didn&apos;t receive the code?{" "}
                {countdown > 0 ? (
                  <span className="text-gray-400">Resend in {countdown}s</span>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={loading}
                    className="text-blue-500 hover:underline disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                )}
              </p>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            className="w-full"
            onClick={step === 1 ? handleSendOtp : handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <BeatLoader size={10} color="#36d7b7" />
            ) : step === 1 ? (
              "Send Reset Code"
            ) : (
              "Reset Password"
            )}
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => (step === 1 ? navigate("/auth") : setStep(1))}
          >
            {step === 1 ? "Back to Login" : "Change Email"}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default ForgotPassword;
