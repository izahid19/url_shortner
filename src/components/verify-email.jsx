import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail, resendOtp } from "@/db/apiAuth";
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
import { UrlState } from "@/context";
import { MailCheck, ArrowLeft } from "lucide-react";

const VerifyEmail = () => {
  let [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const longLink = searchParams.get("createNew");

  const navigate = useNavigate();
  const { fetchUser } = UrlState();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!email) {
      navigate("/auth");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await verifyEmail({ email, otp });
      toast.success("Email verified successfully!");
      await fetchUser();
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError(null);

    try {
      await resendOtp({ email, type: "verify" });
      toast.success("OTP sent successfully!");
      setCountdown(60);
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleVerify();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [otp]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <ToastContainer theme="dark" />
      <Card className="max-w-md w-full bg-zinc-900/80 border-neutral-800 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 bg-[#f97316]/20 rounded-full flex items-center justify-center mb-4">
            <MailCheck className="w-6 h-6 text-[#f97316]" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-gray-400">
            We&apos;ve sent a verification code to{" "}
            <span className="text-white font-medium">{email}</span>
          </CardDescription>
          {error && <Error message={error} />}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300 text-center">
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
          <p className="text-sm text-gray-400 text-center">
            Didn&apos;t receive the code?{" "}
            {countdown > 0 ? (
              <span className="text-gray-500">Resend in {countdown}s</span>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-[#f97316] hover:text-[#ea580c] hover:underline disabled:opacity-50"
              >
                {resending ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-2">
          <Button
            className="w-full h-12 bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold"
            onClick={handleVerify}
            disabled={loading || otp.length !== 6}
          >
            {loading ? <BeatLoader size={10} color="#ffffff" /> : "Verify Email"}
          </Button>
          <Button
            variant="ghost"
            className="w-full text-gray-400 hover:text-white hover:bg-zinc-800"
            onClick={() => navigate("/auth")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmail;
