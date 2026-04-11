import { z } from "zod";
import React from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerUser } from "../services/authService";
import { useContext,useState } from "react";
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
    <>
      <div>Signup Form</div>
      <form onSubmit={handleSubmit(handleSignUpFormSubmit)}>
        <div>
          <label htmlFor="firstname">First Name:</label>
          <input {...register("firstname")}></input>
          {errors.firstname && <p>{errors.firstname.message}</p>}
        </div>
        <div>
          <label htmlFor="lastname">Last Name:</label>
          <input {...register("lastname")}></input>
          {errors.lastname && <p>{errors.lastname.message}</p>}
        </div>

        <div>
          <label htmlFor="phonenumber">Phone:</label>
          <input {...register("phonenumber")}></input>
          {errors.phonenumber && <p>{errors.phonenumber.message}</p>}
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input {...register("email")}></input>
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input {...register("password")}></input>
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input {...register("confirmPassword")}></input>
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          Sign Up
        </button>
      </form>
    </>
  );
}

export default SignUpForm;
