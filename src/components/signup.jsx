import { useEffect, useRef, useState } from "react";
import { FaEye, FaEyeSlash, FaTrashAlt } from "react-icons/fa";
import Error from "./error";
import { Input } from "./ui/input";
import * as Yup from "yup";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { signup } from "@/db/apiAuth";
import { BeatLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    profile_pic: null,
  });
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));

    if (name === "profile_pic" && files?.[0]) {
      setProfilePicPreview(URL.createObjectURL(files[0]));
    }

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[name];
      return updatedErrors;
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    validateField(name);
  };

  const validateField = async (fieldName) => {
    const schema = Yup.object().shape({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
      profile_pic: Yup.mixed().required("Profile picture is required"),
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

  const handleDeleteProfilePic = () => {
    setFormData((prevState) => ({
      ...prevState,
      profile_pic: null,
    }));
    setProfilePicPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const { loading, error, fn: fnSignup, data } = useFetch(signup, formData);

  useEffect(() => {
    if (error === null && data) {
      toast.success("Account created successfully!");
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
  }, [error, data, longLink, navigate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleSignup();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [formData]); // Attach the listener with the latest state

  const handleSignup = async () => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
        confirm_password: Yup.string()
          .oneOf([Yup.ref("password"), null], "Passwords must match")
          .required("Confirm Password is required"),
        profile_pic: Yup.mixed().required("Profile picture is required"),
      });

      await schema.validate(formData, { abortEarly: false });
      await fnSignup();
    } catch (error) {
      const newErrors = {};
      if (error?.inner) {
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });

        setErrors(newErrors);
      } else {
        setErrors({ api: error.message });
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <Card className="max-w-md w-full mx-auto p-4 sm:p-6 space-y-4">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-2xl">Signup</CardTitle>
          <CardDescription className="text-center text-sm text-gray-600">
            Create a new account if you haven&rsquo;t already
          </CardDescription>
          {error && <Error message={error?.message} />}
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              name="name"
              type="text"
              placeholder="Enter Name"
              onBlur={handleBlur}
              onChange={handleInputChange}
              className="w-full"
            />
            {errors.name && <Error message={errors.name} />}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
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
            <label className="block text-sm font-medium mb-1">Password</label>
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
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <div className="relative">
              <Input
                name="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                onBlur={handleBlur}
                onChange={handleInputChange}
                className="w-full"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.confirm_password && <Error message={errors.confirm_password} />}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Profile Picture</label>
            <input
              ref={fileInputRef}
              name="profile_pic"
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="w-full"
            />
            {profilePicPreview && (
              <div className="flex items-center mt-2">
                <img
                  src={profilePicPreview}
                  alt="Profile Preview"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <FaTrashAlt
                  className="text-red-500 cursor-pointer ml-2"
                  onClick={handleDeleteProfilePic}
                />
              </div>
            )}
            {errors.profile_pic && <Error message={errors.profile_pic} />}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? <BeatLoader size={10} color="#36d7b7" /> : "Create Account"}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default Signup;
