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
import { Mail, Lock, Eye, EyeOff, KeyRound, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <ToastContainer theme="dark" />
      <Card className="max-w-md w-full bg-zinc-900/80 border-neutral-800 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 bg-[#f97316]/20 rounded-full flex items-center justify-center mb-4">
            <KeyRound className="w-6 h-6 text-[#f97316]" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {step === 1 ? "Forgot Password" : "Reset Password"}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {step === 1
              ? "Enter your email to receive a reset code"
              : `Enter the code sent to ${email}`}
          </CardDescription>
          {error && <Error message={error} />}
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 ? (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-zinc-800/50 border-neutral-700 text-white placeholder:text-gray-500 focus:border-[#f97316] focus:ring-[#f97316]/20"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Enter 6-digit OTP
                </label>
                <Input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="h-14 text-center text-2xl tracking-[0.5em] bg-zinc-800/50 border-neutral-700 text-white placeholder:text-gray-500 focus:border-[#f97316]"
                  maxLength={6}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-zinc-800/50 border-neutral-700 text-white placeholder:text-gray-500 focus:border-[#f97316]"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-zinc-800/50 border-neutral-700 text-white placeholder:text-gray-500 focus:border-[#f97316]"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-400 text-center">
                Didn&apos;t receive the code?{" "}
                {countdown > 0 ? (
                  <span className="text-gray-500">Resend in {countdown}s</span>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={loading}
                    className="text-[#f97316] hover:text-[#ea580c] hover:underline disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                )}
              </p>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-2">
          <Button
            className="w-full h-12 bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold"
            onClick={step === 1 ? handleSendOtp : handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <BeatLoader size={10} color="#ffffff" />
            ) : step === 1 ? (
              "Send Reset Code"
            ) : (
              "Reset Password"
            )}
          </Button>
          <Button
            variant="ghost"
            className="w-full text-gray-400 hover:text-white hover:bg-zinc-800"
            onClick={() => (step === 1 ? navigate("/auth") : setStep(1))}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {step === 1 ? "Back to Login" : "Change Email"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
