import { z } from "zod";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerUser } from "../services/authService";
import { useContext, useState } from "react";
import { UserAuthContext } from "../AuthProvider";
import { useNavigate } from "react-router";

const signUpUserSchema = z
  .object({
    firstname: z.string().min(3),
    lastname: z.string().min(2),
    phonenumber: z.string().min(10).max(10, "Phone number must be 10 digits"),
    email: z.email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least six characters long." }),
    confirmPassword: z
      .string()
      .min(6, { message: "Please confirm your password." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords donot match",
    path: ["confirmPassword"],
  });

function SignUpForm() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { login } = useContext(UserAuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onChange", resolver: zodResolver(signUpUserSchema) });

  async function handleSignUpFormSubmit(data) {
    setError(null);
    try {
      const { user, error } = await registerUser(data);
      if (user) {
        login(user);
        navigate("/");
      } else {
        setError(error);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center bg-background py-20 px-4">
      <div className="w-full max-w-xl bg-surface p-10 border border-white/5 shadow-xl">
        <div className="text-center mb-10">
          <h2 className="text-text text-3xl font-light tracking-[0.3em] uppercase">
            Join the Studio
          </h2>
          <p className="text-muted text-xs mt-2 tracking-widest">
            Create an account to treasure your moments
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleSignUpFormSubmit)}
          className="space-y-6"
        >
          {/* Two Columns for Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-muted text-xs uppercase tracking-widest">
                First Name
              </label>
              <input
                {...register("firstname")}
                className="bg-background border border-white/10 p-3 text-text outline-none focus:border-accent transition-colors"
                placeholder="Jane"
              />
              {errors.firstname && (
                <p className="text-red-500 text-[10px] uppercase">
                  {errors.firstname.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-muted text-xs uppercase tracking-widest">
                Last Name
              </label>
              <input
                {...register("lastname")}
                className="bg-background border border-white/10 p-3 text-text outline-none focus:border-accent transition-colors"
                placeholder="Doe"
              />
              {errors.lastname && (
                <p className="text-red-500 text-[10px] uppercase">
                  {errors.lastname.message}
                </p>
              )}
            </div>
          </div>

          {/* Phone and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-muted text-xs uppercase tracking-widest">
                Phone Number
              </label>
              <input
                {...register("phonenumber")}
                className="bg-background border border-white/10 p-3 text-text outline-none focus:border-accent transition-colors"
                placeholder="98XXXXXXXX"
              />
              {errors.phonenumber && (
                <p className="text-red-500 text-[10px] uppercase">
                  {errors.phonenumber.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-muted text-xs uppercase tracking-widest">
                Email Address
              </label>
              <input
                {...register("email")}
                className="bg-background border border-white/10 p-3 text-text outline-none focus:border-accent transition-colors"
                placeholder="jane@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-[10px] uppercase">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-6">
            <div className="flex flex-col gap-2">
              <label className="text-muted text-xs uppercase tracking-widest">
                Password
              </label>
              <input
                type="password"
                {...register("password")}
                className="bg-background border border-white/10 p-3 text-text outline-none focus:border-accent transition-colors"
              />
              {errors.password && (
                <p className="text-red-500 text-[10px] uppercase">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-muted text-xs uppercase tracking-widest">
                Confirm Password
              </label>
              <input
                type="password"
                {...register("confirmPassword")}
                className="bg-background border border-white/10 p-3 text-text outline-none focus:border-accent transition-colors"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-[10px] uppercase">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 p-3 text-red-500 text-xs text-center uppercase tracking-widest">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent text-black py-4 uppercase tracking-[0.2em] text-sm font-bold hover:bg-white transition-all duration-500 disabled:opacity-50"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUpForm;
