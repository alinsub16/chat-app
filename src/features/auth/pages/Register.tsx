import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@features/auth/hooks/useAuth";
import { RegisterData } from "@features/auth/types/auth";
import AuthForm from "@features/auth/components/AuthForm";
import Modal from "@components/ui/Modal";


const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [modal, setModal] = useState({ show: false, title: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (data: RegisterData) => {
    setIsSubmitting(true);
    try {
        await register(data);
        setModal({
          show: true,
          title: "Registration Successful ✅",
          message: "You can now log in.",
        });
        setTimeout(() => {
          setModal((m) => ({ ...m, show: false }));
          navigate("/login-page");
        }, 1500);
    } catch (err: any) {
      setModal({
        show: true,
        title: "Error",
        message: err.message || "Something went wrong.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-white text-xl font-bold mb-4">Create an account</h2>
      <AuthForm mode="register" onSubmit={handleRegister} isSubmitting={isSubmitting} />

      <Modal
        show={modal.show}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal((m) => ({ ...m, show: false }))}
      />
    </div>
  );
};

export default Register;
