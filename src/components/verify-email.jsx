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
      setCountdown(60); // 60 second cooldown
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
    <>
      <ToastContainer />
      <Card className="max-w-md w-full mx-auto p-4 sm:p-6 space-y-4">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-2xl">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-center text-sm text-gray-600">
            We&apos;ve sent a verification code to <strong>{email}</strong>
          </CardDescription>
          {error && <Error message={error} />}
        </CardHeader>
        <CardContent className="space-y-4">
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
          <p className="text-sm text-gray-500 text-center">
            Didn&apos;t receive the code?{" "}
            {countdown > 0 ? (
              <span className="text-gray-400">Resend in {countdown}s</span>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-blue-500 hover:underline disabled:opacity-50"
              >
                {resending ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            className="w-full"
            onClick={handleVerify}
            disabled={loading || otp.length !== 6}
          >
            {loading ? <BeatLoader size={10} color="#36d7b7" /> : "Verify Email"}
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => navigate("/auth")}
          >
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default VerifyEmail;
