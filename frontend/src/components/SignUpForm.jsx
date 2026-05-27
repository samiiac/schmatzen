import { z } from "zod";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerUser } from "../services/authService";
import { useContext } from "react";
import { UserAuthContext } from "../AuthProvider";

const signUpUserSchema = z.object({
  firstname: z.string().min(2, "First name must be at least 2 characters"),
  lastname: z.string().min(1),
  phonenumber: z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  email: z.email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string().min(6, "Please confirm your password."),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match.", path: ["confirmPassword"],
});

function SignUpForm() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { login } = useContext(UserAuthContext);
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm({ mode: "onChange", resolver: zodResolver(signUpUserSchema) });

  async function handleSignUpFormSubmit(data) {
    setError(null);
    try {
      const payload = { ...data };
      delete payload.confirmPassword;
      const { user, error: err } = await registerUser(payload);
      if (user) { login(user); navigate("/"); }
      else { setError(err); }
    } catch { setError("Something went wrong."); }
  }

  return (
    <form onSubmit={handleSubmit(handleSignUpFormSubmit)} className="auth-form">
      <div className="form-row-sm">
        <div className="form-group">
          <label htmlFor="firstname">First Name</label>
          <input id="firstname" type="text" {...register("firstname")} placeholder="Jane" />
          {errors.firstname && <p className="field-error">{errors.firstname.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="lastname">Last Name</label>
          <input id="lastname" type="text" {...register("lastname")} placeholder="Doe" />
          {errors.lastname && <p className="field-error">{errors.lastname.message}</p>}
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="phonenumber">Phone Number</label>
        <input id="phonenumber" type="tel" {...register("phonenumber")} placeholder="9876543210" />
        {errors.phonenumber && <p className="field-error">{errors.phonenumber.message}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register("email")} placeholder="you@example.com" />
        {errors.email && <p className="field-error">{errors.email.message}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input id="password" type="password" {...register("password")} placeholder="At least 6 characters" />
        {errors.password && <p className="field-error">{errors.password.message}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input id="confirmPassword" type="password" {...register("confirmPassword")} placeholder="Re-enter your password" />
        {errors.confirmPassword && <p className="field-error">{errors.confirmPassword.message}</p>}
      </div>
      {error && <p className="form-message error">{error}</p>}
      <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-full">
        {isSubmitting ? "Creating…" : "Create Account"}
      </button>
      <p className="auth-switch">Already have an account? <a href="/auth/login">Sign in</a></p>
    </form>
  );
}

export default SignUpForm;
