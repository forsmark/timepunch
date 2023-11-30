import { useEffect, useState } from "react";

import Card from "../components/Card";
import TextField from "../components/TextField";
import Button from "../components/Button";
import { emailRegex, rememberMe, signIn } from "../utils/auth";
import { useNavigate } from "@tanstack/react-router";

const Login = () => {
  const navigate = useNavigate({ from: "/login" });
  const [
    { email, password, emailValid, passwordValid, emailDirty, passwordDirty },
    setFormState,
  ] = useState(() => ({
    email: "",
    password: "",
    emailValid: false,
    passwordValid: false,
    emailDirty: false,
    passwordDirty: false,
  }));

  const validateForm = (field?: "email" | "password") => {
    if (field === "email" && emailDirty) {
      const emailValid = emailRegex.test(email);
      setFormState((prev) => ({ ...prev, emailValid }));
      return;
    }

    if (field === "password" && passwordDirty) {
      const passwordValid = !!password;
      setFormState((prev) => ({ ...prev, passwordValid }));
      return;
    }
  };

  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({
      ...prev,
      email: event.target.value,
      emailDirty: true,
    }));
  };

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({
      ...prev,
      password: event.target.value,
      passwordDirty: true,
    }));
  };

  useEffect(() => {
    validateForm("email");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  useEffect(() => {
    validateForm("password");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);

  const goToHome = () => {
    void navigate({ to: "/" });
  };

  const handleSignIn = () => {
    if (emailValid && passwordValid) {
      void signIn(email, password, goToHome);
    }
  };

  useEffect(() => {
    void rememberMe(goToHome);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <form
        className="flex flex-col gap-1"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <TextField
          value={email}
          onChange={handleEmail}
          type="email"
          name="email"
          label="E-mail"
          state={!emailValid && emailDirty ? "error" : undefined}
          subText={!emailValid && emailDirty ? "Invalid e-mail" : undefined}
          enableSubText
          onBlur={() => validateForm("email")}
        />
        <TextField
          value={password}
          onChange={handlePassword}
          type="password"
          name="password"
          label="Password"
          state={!passwordValid && passwordDirty ? "error" : undefined}
          subText={
            !passwordValid && passwordDirty ? "Missing password" : undefined
          }
          enableSubText
          onBlur={() => validateForm("password")}
        />
        <Button
          className="mt-2"
          onClick={handleSignIn}
          disabled={!emailValid || !passwordValid}
        >
          Sign In
        </Button>
      </form>
    </Card>
  );
};

export default Login;
