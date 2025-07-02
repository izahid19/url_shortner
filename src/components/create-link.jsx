import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card } from "./ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Error from "./error";
import * as yup from "yup";
import useFetch from "@/hooks/use-fetch";
import { createUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";
import { UrlState } from "@/context";
import { QRCode } from "react-qrcode-logo";

export function CreateLink() {
  const { user } = UrlState();

  const navigate = useNavigate();
  const ref = useRef();

  let [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [isDialogOpen, setIsDialogOpen] = useState(!!longLink);
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longLink ? longLink : "",
    customUrl: "",
  });

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup
      .string()
      .url("Must be a valid URL")
      .required("Long URL is required"),
    customUrl: yup.string(),
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[e.target.id];
      return updatedErrors;
    });
  };

  const handleBlur = async (e) => {
    const fieldName = e.target.id;
    try {
      await schema.validateAt(fieldName, formValues);
    } catch (err) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: err.message,
      }));
    }
  };

  const {
    loading,
    error,
    data,
    fn: fnCreateUrl,
  } = useFetch(createUrl, { ...formValues, user_id: user.id });

  useEffect(() => {
    if (error === null && data) {
      navigate(`/link/${data[0].id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, data]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        createNewLink();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [formValues]); // Attach listener with the latest state

  const createNewLink = async () => {
    setErrors([]);
    try {
      await schema.validate(formValues, { abortEarly: false });

      const canvas = ref.current.canvasRef.current;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve));

      await fnCreateUrl(blob);
    } catch (e) {
      const newErrors = {};
      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };

  const handleCancel = () => {
    setFormValues({ title: "", longUrl: "", customUrl: "" });
    setErrors({});
    setSearchParams({});
    setIsDialogOpen(false); // Close the dialog
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(res) => {
        setIsDialogOpen(res);
        if (!res) setSearchParams({}); // Update search params when dialog closes
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive">Create New Link</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-sm sm:max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="font-bold text-xl sm:text-2xl text-black">
            Create New
          </DialogTitle>
        </DialogHeader>
        {formValues?.longUrl && (
          <div className="flex justify-center mb-4">
            <QRCode ref={ref} size={250} value={formValues?.longUrl} />
          </div>
        )}
        <div className="flex flex-col space-y-4">
          <div>
            <label className="text-sm sm:text-base text-black mb-1 block">
              Short Link's Title
            </label>
            <Input
              id="title"
              placeholder="Enter Your Title"
              value={formValues.title}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full text-gray-900"
            />
            {errors.title && <Error message={errors.title} />}
          </div>
          <div>
            <label className="text-sm sm:text-base text-black mb-1 block">
              Long URL
            </label>
            <Input
              id="longUrl"
              placeholder="Enter your Loooong URL"
              value={formValues.longUrl}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full text-gray-900"
            />
            {errors.longUrl && <Error message={errors.longUrl} />}
          </div>
          <div>
            <label className="text-sm sm:text-base text-black mb-1 block">
              Custom URL (optional)
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              <Card className="p-2 text-sm sm:text-base">trimmm.netlify.app</Card>
              <span className="text-sm">/</span>
              <Input
                id="customUrl"
                placeholder="Custom Link (optional)"
                value={formValues.customUrl}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full sm:w-auto flex-grow text-gray-900"
              />
            </div>
          </div>
        </div>
        {error && <Error message={errors.message} />}
        <DialogFooter className="sm:justify-start mt-4">
          <Button
            type="button"
            variant="destructive"
            onClick={createNewLink}
            disabled={loading}
          >
            {loading ? <BeatLoader size={10} color="white" /> : "Create"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="ml-2 text-gray-800"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}