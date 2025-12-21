import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ImagePlus, Trash2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";

const AVATARS = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Scooter",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Precious",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Angel",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Shadow",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Buster",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Missy",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Pumpkin",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Snuggles",
];
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
  const [isModalOpen, setIsModalOpen] = useState(false);



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



  const { loading, error, fn: fnSignup, data } = useFetch(signup, formData);

  useEffect(() => {
    if (error === null && data) {
      toast.success("Please check your email for verification code!");
      navigate(`/verify-email?email=${encodeURIComponent(formData.email)}${longLink ? `&createNew=${longLink}` : ""}`);
    }
  }, [error, data, longLink, navigate, formData.email]);

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
  }, [formData]);

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
      <ToastContainer theme="dark" />
      <Card className="max-w-md w-full mx-auto bg-zinc-900/80 border-neutral-800 backdrop-blur-sm mb-20 sm:mb-0">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
          <CardDescription className="text-gray-400">
            Join us and start shortening your links
          </CardDescription>
          {error && <Error message={error?.message} />}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                name="name"
                type="text"
                placeholder="Enter your name"
                onBlur={handleBlur}
                onChange={handleInputChange}
                className="pl-10 h-12 bg-zinc-800/50 border-neutral-700 text-white placeholder:text-gray-500 focus:border-[#f97316] focus:ring-[#f97316]/20"
              />
            </div>
            {errors.name && <Error message={errors.name} />}
          </div>

          {/* Email Field */}
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

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
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

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                name="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                onBlur={handleBlur}
                onChange={handleInputChange}
                className="pl-10 pr-10 h-12 bg-zinc-800/50 border-neutral-700 text-white placeholder:text-gray-500 focus:border-[#f97316] focus:ring-[#f97316]/20"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirm_password && <Error message={errors.confirm_password} />}
          </div>

          {/* Profile Picture Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Profile Picture</label>
            <div className="flex flex-col items-center gap-4 p-4 bg-zinc-800/30 rounded-lg border border-dashed border-neutral-700">
              {profilePicPreview ? (
                <div className="flex flex-col items-center gap-3">
                   <div className="relative group">
                     <div className="absolute inset-0 bg-[#f97316]/20 rounded-full blur-xl opacity-50"></div>
                     <img
                      src={profilePicPreview}
                      alt="Profile Preview"
                      className="w-24 h-24 rounded-full object-cover ring-4 ring-[#f97316]/20 relative z-10 bg-zinc-900"
                    />
                   </div>
                   <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsModalOpen(true)}
                      className="h-8 text-xs border-white/10 hover:bg-white/5"
                   >
                      Change Avatar
                   </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 w-full">
                  <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-2">
                    <User className="w-8 h-8 text-gray-600" />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(true)}
                    className="w-full border-dashed border-white/20 hover:border-[#f97316] hover:text-[#f97316] transition-all"
                  >
                    Choose an Avatar
                  </Button>
                </div>
              )}
            </div>
            {errors.profile_pic && <Error message={errors.profile_pic} />}
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Button
            className="w-full h-12 bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold text-base transition-all duration-200"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? <BeatLoader size={10} color="#ffffff" /> : "Create Account"}
          </Button>
        </CardFooter>
      </Card>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-zinc-900 border-neutral-800">
          <DialogHeader>
            <DialogTitle className="text-white">Select an Avatar</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-5 gap-4 py-4">
            {AVATARS.map((avatar, index) => (
              <button
                key={index}
                className="relative group aspect-square rounded-full overflow-hidden border-2 border-transparent hover:border-[#f97316] transition-all"
                onClick={() => {
                  setFormData(prev => ({ ...prev, profile_pic: avatar }));
                  setProfilePicPreview(avatar);
                  setIsModalOpen(false);
                  // Clear errors for profile_pic
                  setErrors((prevErrors) => {
                    const updatedErrors = { ...prevErrors };
                    delete updatedErrors.profile_pic;
                    return updatedErrors;
                  });
                }}
              >
                <img
                  src={avatar}
                  alt={`Avatar ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Signup;