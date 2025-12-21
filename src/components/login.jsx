import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import * as Yup from "yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import { login } from "@/db/apiAuth";
import { BeatLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import { UrlState } from "@/context";
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

const Login = () => {
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { loading, error, fn: fnLogin, data } = useFetch(login, formData);
  const { fetchUser } = UrlState();

  useEffect(() => {
    if (error === null && data) {
      toast.success("Logged in successfully!");
      fetchUser();
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
  }, [error, data, fetchUser, longLink, navigate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleLogin();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[name];
      return updatedErrors;
    });
  };

  const validateField = async (fieldName) => {
    const schema = Yup.object().shape({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Password is required")
        .required("Password is required"),
    });

    try {
      await schema.validateAt(fieldName, formData);
    } catch (err) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: err.message,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    validateField(name);
  };

  const handleLogin = async () => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string()
          .min(1, "Password is required")
          .required("Password is required"),
      });

      await schema.validate(formData, { abortEarly: false });
      await fnLogin();
    } catch (e) {
      const newErrors = {};

      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);

      console.error("Validation/API error occurred:", e);
    }
  };

  return (
    <>
      <ToastContainer theme="dark" />
      <Card className="max-w-md w-full mx-auto bg-zinc-900/80 border-neutral-800 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-white">Login</CardTitle>
          <CardDescription className="text-gray-400">
            to your account if you already have one
          </CardDescription>
          {error && <Error message={error.message} />}
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                name="email"
                type="email"
                placeholder="Enter your email"
                onBlur={handleBlur}
                onChange={handleInputChange}
                className="pl-10 h-12 bg-zinc-800/50 border-neutral-700 text-white placeholder:text-gray-500 focus:border-[#f97316] focus:ring-[#f97316]/20"
              />
            </div>
            {errors.email && <Error message={errors.email} />}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                onBlur={handleBlur}
                onChange={handleInputChange}
                className="pl-10 pr-10 h-12 bg-zinc-800/50 border-neutral-700 text-white placeholder:text-gray-500 focus:border-[#f97316] focus:ring-[#f97316]/20"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <Error message={errors.password} />}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-[#f97316] hover:text-[#ea580c] hover:underline transition-colors"
            >
              Forgot Password?
            </button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-2">
          <Button
            className="w-full h-12 bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold text-base transition-all duration-200"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <BeatLoader size={10} color="#ffffff" /> : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default Login;
