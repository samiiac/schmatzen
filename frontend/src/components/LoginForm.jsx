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
  password: z.string().min(3),
});

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useContext(UserAuthContext);
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onChange", resolver: zodResolver(loginUserSchema) });
  async function handleFormSubmit(data) {
    setError(null);
    try {
      console.log(data);

      const response = await loginUser(data);
      const { user, error } = response;
      if (user) {
        login(user);
        navigate("/");
      } else {
        console.log(error);
        setError(error);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-surface p-10 border border-white/5 shadow-2xl">
        <div className="text-center mb-10">
          <h2 className="text-text text-3xl font-light tracking-[0.3em] uppercase">
            Login
          </h2>
          <p className="text-muted text-xs mt-2 tracking-widest">
            Access your Schatzen account
          </p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-muted text-xs uppercase tracking-widest"
            >
              Email
            </label>
            <input
              {...register("email")}
              className="bg-background border border-white/10 p-3 text-text outline-none focus:border-accent transition-colors duration-300"
              placeholder="email@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-[10px] uppercase tracking-tighter">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-muted text-xs uppercase tracking-widest"
            >
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="bg-background border border-white/10 p-3 text-text outline-none focus:border-accent transition-colors duration-300"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-[10px] uppercase tracking-tighter">
                {errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 p-3 text-red-500 text-xs text-center uppercase tracking-widest">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent text-black py-4 uppercase tracking-[0.2em] text-sm font-bold hover:bg-white transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Authenticating..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
