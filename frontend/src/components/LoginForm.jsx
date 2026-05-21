import { z } from "zod";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginUser } from "../services/authService";
import { useContext } from "react";
import { UserAuthContext } from "../AuthProvider";

const loginUserSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
  password: z.string().min(3, { message: "Password must be at least 3 characters." }),
});

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useContext(UserAuthContext);
  const [error, setError] = useState(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm({ mode: "onChange", resolver: zodResolver(loginUserSchema) });

  async function handleFormSubmit(data) {
    setError(null);
    try {
      const response = await loginUser(data);
      const { user } = response;
      if (user) { login(user); navigate("/"); }
      else { setError(response.error); }
    } catch { setError("Something went wrong."); }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="auth-form">
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register("email")} placeholder="you@example.com" />
        {errors.email && <p className="field-error">{errors.email.message}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input id="password" type="password" {...register("password")} placeholder="••••••••" />
        {errors.password && <p className="field-error">{errors.password.message}</p>}
      </div>
      {error && <p className="form-message error">{error}</p>}
      <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-full">
        {isSubmitting ? "Signing in…" : "Sign In"}
      </button>
      <p className="auth-switch">Don't have an account? <a href="/auth/signup">Sign up</a></p>
    </form>
  );
}

export default LoginForm;
