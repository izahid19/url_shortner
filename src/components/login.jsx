import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
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
  const [showPassword, setShowPassword] = useState(false); // Track password visibility

  const { loading, error, fn: fnLogin, data } = useFetch(login, formData);
  const { fetchUser } = UrlState();

  useEffect(() => {
    if (error === null && data) {
      toast.success("Logged in successfully!");
      fetchUser();
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
  }, [error, data, fetchUser, longLink, navigate]);

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
          .min(6, "Password must be at least 6 characters")
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
      <ToastContainer />
      <Card className="max-w-md w-full mx-auto p-4 sm:p-6 space-y-4">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-2xl">Login</CardTitle>
          <CardDescription className="text-center text-sm text-gray-600">
            to your account if you already have one
          </CardDescription>
          {error && <Error message={error.message} />}
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <Input
              name="email"
              type="email"
              placeholder="Enter Email"
              onBlur={handleBlur}
              onChange={handleInputChange}
              className="w-full"
            />
            {errors.email && <Error message={errors.email} />}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                onBlur={handleBlur}
                onChange={handleInputChange}
                className="w-full"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && <Error message={errors.password} />}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <BeatLoader size={10} color="#36d7b7" /> : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default Login;
