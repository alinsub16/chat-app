import React, { useState } from "react";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { LoginData, RegisterData } from "@features/auth/types/auth";

type AuthFormProps<T extends "login" | "register"> = {
  mode: T;
  onSubmit: (data: T extends "login" ? LoginData : RegisterData) => void | Promise<void>;
  isSubmitting?: boolean;
  
};
const AuthForm= <T extends "login" | "register"> ({ mode, onSubmit, isSubmitting, }: AuthFormProps<T>) => {
  const [formData, setFormData] = useState<LoginData | RegisterData>(
    mode === "login"
      ? { email: "", password: "" }
      : {
          firstName: "",
          lastName: "",
          middleName: "",
          email: "",
          phoneNumber: "",
          password: "",
          profilePicture: null,
        }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "profilePicture" && files ? files[0] : value, }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as any);
  };

  return (

    <>
      <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "login" && (
              <>
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </>
          )}
          

          {/* Register-specific fields */}
          {mode === "register" && (
            <>
              
              <Input
                label="First Name"
                name="firstName"
                type="text"
                placeholder="Enter your first name"
                value={(formData as RegisterData).firstName}
                onChange={handleChange}
                required
              />
              <Input
                label="Midle Name"
                name="middleName"
                type="text"
                placeholder="Enter your middle name"
                value={(formData as RegisterData).middleName}
                onChange={handleChange}
              />
              <Input
                label="Last Name"
                name="lastName"
                type="text"
                placeholder="Enter your last name"
                value={(formData as RegisterData).lastName}
                onChange={handleChange}
                required
              />
              <Input
                label="Phone Number"
                name="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                value={(formData as RegisterData).phoneNumber}
                onChange={handleChange}
              />
              
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Input
                label="Upload Picture"
                name="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleChange}
                variant="small"
              />
            </>

          )}
          <div className="flex justify-end gap-10 ">
            
            <Button type="submit" isLoading={isSubmitting} className="w-25" >
              {mode === "login" ? "Login" : "Register"}
            </Button>
          </div>
        </form>
      </>
  );
};

export default AuthForm;
