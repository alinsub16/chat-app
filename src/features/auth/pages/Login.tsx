import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@features/auth/hooks/useAuth";
import { LoginData } from "@features/auth/types/auth";
import Modal from "@components/ui/Modal";
import AuthForm from "@features/auth/components/AuthForm";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [modal, setModal] = useState({ show: false, title: "", message: "",showButton: true, });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (data: LoginData) => {
    setIsSubmitting(true);
    try {
       await login(data);
        setModal({
          show: true,
          title: "Login Successful",
          message: "Redirecting to dashboard...",
          showButton: false
        });
        setTimeout(() => {
          setModal((m) => ({ ...m, show: false }));
          navigate("/chat");
        }, 1500);
    } catch (err: any) {
      setModal({
        show: true,
        title: "Error",
        message: err.message || "Something went wrong.",
        showButton: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-gray-600 text-md font-bold mb-4 md:hidden sm:text-xl">Login to your account</h2>
      <AuthForm mode="login" onSubmit={handleLogin} isSubmitting={isSubmitting} />
      <Modal
        show={modal.show}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal((m) => ({ ...m, show: false }))}
        showButton={modal.showButton}
      />
    </div>

  );
};

export default Login;
