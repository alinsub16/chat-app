import React, { useState } from "react";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { LoginData, RegisterData } from "@features/auth/types/auth";
import { loginSchema,registerSchema,} from "@features/auth/validation/auth.schema";
import { Eye, EyeOff } from "lucide-react";

/* =======================
   TYPES
======================= */
type Mode = "login" | "register";

type AuthFormProps<T extends Mode> = {
  mode: T;
  onSubmit: (
    data: T extends "login" ? LoginData : RegisterData
  ) => void | Promise<void>;
  isSubmitting?: boolean;
};

/* =======================
   COMPONENT
======================= */
const AuthForm = <T extends Mode>({ mode, onSubmit, isSubmitting, }: AuthFormProps<T>) => {
  const isLogin = mode === "login";

  /* =======================
     STATE
  ======================= */
  const [formData, setFormData] = useState<LoginData | RegisterData>(
    isLogin
      ? { email: "", password: "" }
      : {
          firstName: "",
          middleName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          password: "",
          profilePicture: undefined,
        }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  /* =======================
     HANDLE CHANGE
  ======================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "profilePicture" && files ? files[0] : value,
    }));

    //  Clear error on change
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /* =======================
     VALIDATE + SUBMIT
  ======================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const schema = isLogin ? loginSchema : registerSchema;

    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((err) => {
        const field = err.path[0];
        if (field) {
          fieldErrors[field.toString()] = err.message;
        }
      });

      setErrors(fieldErrors);
      return;
    }

    try {
      setErrors({});
      await onSubmit(result.data as any);
    } catch (err: any) {
      //  Backend error handling
      const message =
        err?.response?.data?.errors?.[0] ||
        err?.response?.data?.message ||
        "Something went wrong";

      setErrors({ email: message }); // example mapping
    }
  };

  /* =======================
     RENDER
  ======================= */
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* LOGIN */}
      {isLogin && (
        <>
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="name@example.com"
            value={(formData as LoginData).email}
            onChange={handleChange}
            error={errors.email}
          />
          <div className="relative">
            <Input
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Your password"
              value={(formData as LoginData).password}
              onChange={handleChange}
              error={errors.password}
            />
            {/* Eye Icon */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-11 text-gray-400 cursor-pointer"
              >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          </>
      )}

      {/* REGISTER */}
      {!isLogin && (
        <>
          <Input
            label="First Name"
            name="firstName"
            value={(formData as RegisterData).firstName}
            onChange={handleChange}
            error={errors.firstName}
          />

          <Input
            label="Middle Name"
            name="middleName"
            value={(formData as RegisterData).middleName}
            onChange={handleChange}
            error={errors.middleName}
          />

          <Input
            label="Last Name"
            name="lastName"
            value={(formData as RegisterData).lastName}
            onChange={handleChange}
            error={errors.lastName}
          />

          <Input
            label="Phone Number"
            name="phoneNumber"
            value={(formData as RegisterData).phoneNumber}
            onChange={handleChange}
            error={errors.phoneNumber}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={(formData as RegisterData).email}
            onChange={handleChange}
            error={errors.email}
          />
          <div className="relative">
            <Input
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={(formData as RegisterData).password}
              onChange={handleChange}
              error={errors.password}
            />
            {/* Eye Icon */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-11 text-gray-400 cursor-pointer"
              >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <Input
            label="Upload Picture"
            name="profilePicture"
            type="file"
            accept="image/*"
            onChange={handleChange}
            error={errors.profilePicture}
          />
        </>
      )}

      {/* SUBMIT */}
      <div className="flex justify-end">
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          className="w-28"
        >
          {isLogin ? "Login" : "Register"}
        </Button>
      </div>
    </form>
  );
};

export default AuthForm;